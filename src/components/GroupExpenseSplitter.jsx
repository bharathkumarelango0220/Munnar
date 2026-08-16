import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  DollarSign, 
  ArrowRight, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Wallet, 
  Receipt, 
  UserPlus, 
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

const DEFAULT_MEMBERS = ['Bharath', 'Rahul', 'Priya'];

export default function GroupExpenseSplitter() {
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('munnar_group_members');
    return saved ? JSON.parse(saved) : DEFAULT_MEMBERS;
  });

  const [newMemberName, setNewMemberName] = useState('');
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('munnar_group_expenses');
    return saved ? JSON.parse(saved) : [
      {
        id: 'g1',
        title: 'Kolukkumalai 4x4 Jeep Safari',
        amount: 3000,
        paidBy: 'Bharath',
        splitWith: ['Bharath', 'Rahul', 'Priya'],
        date: new Date().toLocaleDateString('en-IN')
      },
      {
        id: 'g2',
        title: 'Kerala Sadhya Lunch at Guru Bhavan',
        amount: 750,
        paidBy: 'Rahul',
        splitWith: ['Bharath', 'Rahul', 'Priya'],
        date: new Date().toLocaleDateString('en-IN')
      }
    ];
  });

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(members[0] || '');
  const [selectedSplit, setSelectedSplit] = useState(members);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem('munnar_group_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('munnar_group_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Add Member
  const handleAddMember = (e) => {
    e.preventDefault();
    const clean = newMemberName.trim();
    if (!clean) return;
    if (members.includes(clean)) {
      alert('Member already added in this group.');
      return;
    }
    const updated = [...members, clean];
    setMembers(updated);
    setSelectedSplit(updated);
    setNewMemberName('');
    if (!paidBy) setPaidBy(clean);
  };

  // Remove Member
  const handleRemoveMember = (name) => {
    if (members.length <= 2) {
      alert('Group must have at least 2 members to split expenses.');
      return;
    }
    const updated = members.filter((m) => m !== name);
    setMembers(updated);
    setSelectedSplit(updated);
    if (paidBy === name) setPaidBy(updated[0]);
    // Clean up expenses
    setExpenses((prev) => prev.filter((exp) => exp.paidBy !== name));
  };

  // Add Group Expense
  const handleAddExpense = (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!title.trim() || isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid expense title and amount.');
      return;
    }
    if (selectedSplit.length === 0) {
      alert('Please select at least one person to split this expense with.');
      return;
    }

    const newExp = {
      id: `g_${Date.now()}`,
      title: title.trim(),
      amount: numAmount,
      paidBy,
      splitWith: [...selectedSplit],
      date: new Date().toLocaleDateString('en-IN')
    };

    setExpenses([newExp, ...expenses]);
    setTitle('');
    setAmount('');
    setSelectedSplit(members);

    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.8 }
    });
  };

  // Delete Expense
  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  // Toggle Split Member
  const toggleSplitMember = (member) => {
    if (selectedSplit.includes(member)) {
      if (selectedSplit.length === 1) return;
      setSelectedSplit(selectedSplit.filter((m) => m !== member));
    } else {
      setSelectedSplit([...selectedSplit, member]);
    }
  };

  // Calculate Balances & Minimal Settlements
  const totalGroupSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Per-person calculations
  const balanceSheet = {};
  members.forEach((m) => {
    balanceSheet[m] = { paid: 0, share: 0, net: 0 };
  });

  expenses.forEach((exp) => {
    if (balanceSheet[exp.paidBy]) {
      balanceSheet[exp.paidBy].paid += exp.amount;
    }
    const perPerson = exp.amount / exp.splitWith.length;
    exp.splitWith.forEach((person) => {
      if (balanceSheet[person]) {
        balanceSheet[person].share += perPerson;
      }
    });
  });

  Object.keys(balanceSheet).forEach((m) => {
    balanceSheet[m].net = balanceSheet[m].paid - balanceSheet[m].share;
  });

  // Debt Minimization Algorithm
  const settlements = [];
  const debtors = [];
  const creditors = [];

  Object.entries(balanceSheet).forEach(([name, data]) => {
    const net = Math.round(data.net);
    if (net < 0) {
      debtors.push({ name, amount: -net });
    } else if (net > 0) {
      creditors.push({ name, amount: net });
    }
  });

  let dIdx = 0;
  let cIdx = 0;
  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];
    const settlementAmount = Math.min(debtor.amount, creditor.amount);

    if (settlementAmount > 0) {
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: settlementAmount
      });
    }

    debtor.amount -= settlementAmount;
    creditor.amount -= settlementAmount;

    if (debtor.amount === 0) dIdx++;
    if (creditor.amount === 0) cIdx++;
  }

  // Format WhatsApp Share Message
  const generateShareText = () => {
    let text = `*🌿 Munnar Trip Group Expense Summary*\n`;
    text += `💰 *Total Group Spent:* ₹${totalGroupSpent.toLocaleString('en-IN')}\n`;
    text += `👥 *Members (${members.length}):* ${members.join(', ')}\n\n`;
    text += `*📊 Individual Balances:*\n`;
    members.forEach((m) => {
      const b = balanceSheet[m];
      text += `• ${m}: Paid ₹${Math.round(b.paid)} | Fair Share: ₹${Math.round(b.share)} (${b.net >= 0 ? `+₹${Math.round(b.net)}` : `-₹${Math.round(-b.net)}`})\n`;
    });
    text += `\n*🤝 Final Settlements (Who Pays Whom):*\n`;
    if (settlements.length === 0) {
      text += `All settled up! No one owes anything 🎉\n`;
    } else {
      settlements.forEach((s) => {
        text += `👉 *${s.from}* owes *${s.to}* ₹${s.amount.toLocaleString('en-IN')}\n`;
      });
    }
    text += `\n_Calculated with MunnarGo (https://munnartools.vercel.app)_`;
    return text;
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(generateShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(generateShareText());
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <section className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Smart Group Expense Splitter</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Group Trip Bill Splitter ("Who Owes Whom") 👥💰
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Log shared jeep safaris, hotel rooms, and meals. Auto-compute who pays whom with 1-tap WhatsApp sharing!
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 text-xs font-bold shadow-soft transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Share to WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Member Manager Badge Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Travel Buddies in This Trip ({members.length})</span>
          </h3>
          <span className="text-xs text-slate-400">Add all group members below</span>
        </div>

        {/* Members Pill List */}
        <div className="flex flex-wrap items-center gap-2">
          {members.map((member) => (
            <span
              key={member}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold"
            >
              <span>{member}</span>
              {members.length > 2 && (
                <button
                  onClick={() => handleRemoveMember(member)}
                  className="text-slate-400 hover:text-rose-600 transition-colors"
                  title={`Remove ${member}`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}

          {/* Add Member Form */}
          <form onSubmit={handleAddMember} className="inline-flex items-center gap-1.5">
            <input
              type="text"
              placeholder="+ New Buddy..."
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 w-32"
            />
            <button
              type="submit"
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors"
              title="Add Buddy"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Main 2-Column Section: Add Expense & Settlement Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Col 1: Add Expense Form */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-4">
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Add Shared Group Expense</span>
          </h3>

          <form onSubmit={handleAddExpense} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Expense Title
              </label>
              <input
                type="text"
                placeholder="e.g. Kolukkumalai Jeep, Resort Stay, Lunch"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Amount (₹ INR)
              </label>
              <input
                type="number"
                placeholder="₹ 0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Who Paid for This?
              </label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 font-semibold bg-white"
              >
                {members.map((m) => (
                  <option key={m} value={m}>
                    Paid by {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Split Equally Among ({selectedSplit.length})
              </label>
              <div className="flex flex-wrap gap-1.5">
                {members.map((m) => {
                  const isChecked = selectedSplit.includes(m);
                  return (
                    <button
                      type="button"
                      key={m}
                      onClick={() => toggleSplitMember(m)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        isChecked 
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {isChecked ? `✓ ${m}` : m}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
            >
              Add Group Expense
            </button>
          </form>
        </div>

        {/* Col 2 & 3: Balances & Who Pays Whom Settlement Cards */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-soft">
              <span className="text-[11px] text-slate-400 font-medium">Total Group Spend</span>
              <p className="text-xl font-black text-white mt-1">₹{totalGroupSpent.toLocaleString('en-IN')}</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 shadow-soft">
              <span className="text-[11px] text-emerald-700 font-medium">Avg Per Person</span>
              <p className="text-xl font-black text-emerald-900 mt-1">
                ₹{Math.round(totalGroupSpent / (members.length || 1)).toLocaleString('en-IN')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-950 shadow-soft col-span-2 sm:col-span-1">
              <span className="text-[11px] text-teal-700 font-medium">Settlements Needed</span>
              <p className="text-xl font-black text-teal-900 mt-1">
                {settlements.length} Transfers
              </p>
            </div>
          </div>

          {/* Settle Up Cards ("Who Owes Whom") */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Optimal Settlements (Minimum Transfers)</span>
              </h3>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                Auto-Calculated
              </span>
            </div>

            {settlements.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                🎉 All balances are settled up! No pending payments.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {settlements.map((s, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                        {s.from}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-black text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        {s.to}
                      </span>
                    </div>

                    <span className="text-sm font-black text-slate-900">
                      ₹{s.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Group Expenses Log */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-3">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Shared Expense Log ({expenses.length})
            </h3>

            {expenses.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No shared group expenses added yet.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {expenses.map((exp) => (
                  <div key={exp.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">{exp.title}</h4>
                      <p className="text-[11px] text-slate-500">
                        Paid by <strong className="text-emerald-700 font-bold">{exp.paidBy}</strong> • Split with {exp.splitWith.length} buddies
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-slate-900">
                        ₹{exp.amount.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="text-slate-300 hover:text-rose-600 transition-colors p-1"
                        title="Delete expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </section>
  );
}
