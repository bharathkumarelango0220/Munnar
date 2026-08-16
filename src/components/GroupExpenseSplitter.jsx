import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Copy, 
  Check, 
  Sparkles, 
  MessageCircle,
  RotateCcw,
  UserPlus,
  Receipt,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export default function GroupExpenseSplitter() {
  const { user } = useApp();

  // Start with clean state - no hardcoded dummy names
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('munnar_group_members_clean');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return user?.name ? [user.name] : [];
  });

  const [newMemberInput, setNewMemberInput] = useState('');
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('munnar_group_expenses_clean');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [selectedSplit, setSelectedSplit] = useState([]);
  const [copied, setCopied] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('munnar_group_members_clean', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('munnar_group_expenses_clean', JSON.stringify(expenses));
  }, [expenses]);

  // Update defaults when members change
  useEffect(() => {
    if (members.length > 0) {
      if (!paidBy || !members.includes(paidBy)) {
        setPaidBy(members[0]);
      }
      setSelectedSplit(members);
    }
  }, [members]);

  // Add Member
  const handleAddMember = (e) => {
    e.preventDefault();
    const clean = newMemberInput.trim();
    if (!clean) return;
    if (members.map(m => m.toLowerCase()).includes(clean.toLowerCase())) {
      alert('This member is already added to your group.');
      return;
    }

    const updated = [...members, clean];
    setMembers(updated);
    setSelectedSplit(updated);
    setNewMemberInput('');
  };

  // Remove Member
  const handleRemoveMember = (name) => {
    const updated = members.filter((m) => m !== name);
    setMembers(updated);
    setExpenses((prev) => prev.filter((exp) => exp.paidBy !== name));
  };

  // Reset Everything to Start Fresh
  const handleResetGroup = () => {
    if (confirm('Start a completely new trip? This will clear all group members and shared expenses.')) {
      setMembers([]);
      setExpenses([]);
      setTitle('');
      setAmount('');
      localStorage.removeItem('munnar_group_members_clean');
      localStorage.removeItem('munnar_group_expenses_clean');
    }
  };

  // Add Group Expense
  const handleAddExpense = (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!title.trim()) {
      alert('Please enter what this expense was for (e.g. Jeep Safari, Dinner, Stay).');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount in Rupees.');
      return;
    }
    if (selectedSplit.length === 0) {
      alert('Please select at least one person to split with.');
      return;
    }

    const newExp = {
      id: `g_${Date.now()}`,
      title: title.trim(),
      amount: numAmount,
      paidBy: paidBy || members[0],
      splitWith: [...selectedSplit],
      date: new Date().toLocaleDateString('en-IN')
    };

    setExpenses([newExp, ...expenses]);
    setTitle('');
    setAmount('');
    setSelectedSplit(members);

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  // Delete an individual expense
  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  // Toggle Member in Split
  const toggleSplitMember = (member) => {
    if (selectedSplit.includes(member)) {
      if (selectedSplit.length === 1) return;
      setSelectedSplit(selectedSplit.filter((m) => m !== member));
    } else {
      setSelectedSplit([...selectedSplit, member]);
    }
  };

  // Balance & Settlement Calculations
  const totalGroupSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

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
    text += `*📊 Balances:*\n`;
    members.forEach((m) => {
      const b = balanceSheet[m];
      text += `• ${m}: Paid ₹${Math.round(b.paid)} | Fair Share: ₹${Math.round(b.share)} (${b.net >= 0 ? `+₹${Math.round(b.net)}` : `-₹${Math.round(-b.net)}`})\n`;
    });
    text += `\n*🤝 Who Pays Whom:*\n`;
    if (settlements.length === 0) {
      text += `All settled up! No one owes anything 🎉\n`;
    } else {
      settlements.forEach((s) => {
        text += `👉 *${s.from}* pays *${s.to}* ₹${s.amount.toLocaleString('en-IN')}\n`;
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
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Group Bill Splitter</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Split Group Trip Expenses 👥💰
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Add your travel buddies, log shared bills (Jeep safaris, stays, food), and see who pays whom!
          </p>
        </div>

        {members.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleResetGroup}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-rose-600 text-xs font-bold shadow-soft transition-all"
              title="Start a fresh trip"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start Fresh</span>
            </button>

            {expenses.length > 0 && (
              <>
                <button
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 text-xs font-bold shadow-soft transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleWhatsAppShare}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* STEP 1: Add Travel Group Members */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Step 1
            </span>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-600" />
              <span>Add Your Travel Buddies / Group Members</span>
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {members.length === 0 ? 'No members added yet' : `${members.length} members in trip`}
          </span>
        </div>

        {/* Add Member Input Bar */}
        <form onSubmit={handleAddMember} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type friend or family name (e.g. Arun, Priya, John)..."
            value={newMemberInput}
            onChange={(e) => setNewMemberInput(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 shadow-xs"
          />
          <button
            type="submit"
            className="px-4 sm:px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Person</span>
          </button>
        </form>

        {/* Current Members List */}
        {members.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-1">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">Start by adding at least 2 people who are traveling together!</p>
            <p className="text-[11px] text-slate-400">Type their names above and click "Add Person".</p>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {members.map((m) => (
              <span
                key={m}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-950 border border-emerald-200 text-xs font-bold shadow-xs"
              >
                <span>👤 {m}</span>
                <button
                  onClick={() => handleRemoveMember(m)}
                  className="text-slate-400 hover:text-rose-600 transition-colors ml-1"
                  title={`Remove ${m}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* STEP 2: Only show when 2+ members are added */}
      {members.length >= 2 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Add Group Expense Form */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-4">
            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                Step 2
              </span>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" />
                <span>Add a Shared Bill</span>
              </h3>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  What was this expense for?
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kolukkumalai Jeep Safari, Dinner, Stay"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total Amount (₹ INR)
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
                  Who paid the bill?
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
                  Split equally among:
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
                + Save & Split Expense
              </button>
            </form>
          </div>

          {/* Settle Up & History */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Stats Strip */}
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
                <span className="text-[11px] text-teal-700 font-medium">Transfers Needed</span>
                <p className="text-xl font-black text-teal-900 mt-1">
                  {settlements.length} Settlements
                </p>
              </div>
            </div>

            {/* Who Pays Whom Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                    Step 3
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Who Pays Whom (Direct Settlements)</span>
                  </h3>
                </div>
                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                  Auto-Calculated
                </span>
              </div>

              {expenses.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Add a shared bill on the left to see who owes whom!
                </div>
              ) : settlements.length === 0 ? (
                <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-center text-xs font-bold">
                  🎉 Everything is balanced! No one owes anyone anything.
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

            {/* Shared Expenses Log */}
            {expenses.length > 0 && (
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-3">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Shared Bills Log ({expenses.length})
                </h3>

                <div className="divide-y divide-slate-100">
                  {expenses.map((exp) => (
                    <div key={exp.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">{exp.title}</h4>
                        <p className="text-[11px] text-slate-500">
                          Paid by <strong className="text-emerald-700 font-bold">{exp.paidBy}</strong> • Split with {exp.splitWith.length} people
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-slate-900">
                          ₹{exp.amount.toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="text-slate-300 hover:text-rose-600 transition-colors p-1"
                          title="Delete bill"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      ) : (
        <div className="p-8 bg-emerald-50/50 rounded-3xl border border-emerald-200/60 text-center space-y-2">
          <Sparkles className="w-6 h-6 text-emerald-600 mx-auto" />
          <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
            Add at least 2 people above to unlock bill splitting!
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Once you add your group members, you can record jeep rides, restaurant bills, and room stays to automatically calculate who pays whom.
          </p>
        </div>
      )}

    </section>
  );
}
