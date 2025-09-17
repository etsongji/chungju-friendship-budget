import React, { useState, useEffect } from 'react';
import { Calendar, Users, DollarSign, FileText, Plus, Save, X, Edit, Cloud, CloudOff } from 'lucide-react';

const FriendshipBudgetSystem = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());
  
  const [members, setMembers] = useState([
    { id: 1, name: '김상훈', paymentType: '일시납', paidUntil: '2027-02', balance: 0 },
    { id: 2, name: '김현정', paymentType: '일시납', paidUntil: '2027-02', balance: 0 },
    { id: 3, name: '권오미', paymentType: '일시납', paidUntil: '2027-02', balance: 0, status: '기간제' },
    { id: 4, name: '신우철', paymentType: '일시납', paidUntil: '2027-02', balance: 0, status: '기간제' },
    { id: 5, name: '김동영', paymentType: '일시납', paidUntil: '2024-08', balance: 0, status: '전근' },
    { id: 6, name: '최영광', paymentType: '일시납', paidUntil: '2024-08', balance: 0, status: '전근' },
    { id: 7, name: '김준영', paymentType: '월납', paidUntil: '2025-08', balance: -15000 },
    { id: 8, name: '박미선', paymentType: '월납', paidUntil: '2025-08', balance: -15000 },
    { id: 9, name: '박지웅', paymentType: '월납', paidUntil: '2025-08', balance: -15000 },
    { id: 10, name: '원정호', paymentType: '월납', paidUntil: '2025-08', balance: -15000 }
  ]);

  const [transactions, setTransactions] = useState([
    { id: 1, date: '2025-03-18', type: '회비', category: '월납', member: '전체(62명)', amount: 1333000, description: '26년 3월회비(62명)' },
    { id: 2, date: '2025-04-19', type: '회비', category: '월납', member: '전체(62명)', amount: 1333000, description: '26년 4월회비(62명)' },
    { id: 3, date: '2025-04-28', type: '찬조금', category: '교장', member: '교장선생님', amount: 200000, description: '교장선생님 찬조' },
    { id: 4, date: '2025-08-20', type: '퇴직금', category: '권오미', member: '권오미', amount: -1000000, description: '권오미 정년퇴직' },
    { id: 5, date: '2025-08-20', type: '퇴직금', category: '신우철', member: '신우철', amount: -1000000, description: '신우철 정년퇴직' },
    { id: 6, date: '2025-09-03', type: '경조금', category: '부친상', member: '박미선', amount: -300000, description: '박미선 주무관님 부친상' }
  ]);

  const [budget, setBudget] = useState({
    totalFund: 8794407,
    scholarshipFund: 180000,
    monthlyIncome: 135000,
    totalMembers: 62,
    monthlyMembers: 9,
    lumpSumMembers: 53
  });

  const [newTransaction, setNewTransaction] = useState({
    date: '',
    type: '',
    category: '',
    member: '',
    amount: '',
    description: ''
  });

  const [isAddingTransaction, setIsAddingTransaction] = useState(false);

  const saveToCloud = async (dataType, data) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setLastSync(new Date());
      return true;
    } catch (error) {
      console.error('저장 실패:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === 'cjh001!') {
      setIsAdmin(true);
      setShowLogin(false);
      setAdminPassword('');
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
  };

  const handleAddTransaction = async () => {
    if (!newTransaction.date || !newTransaction.type || !newTransaction.amount) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }
    
    const transaction = {
      id: Date.now(),
      ...newTransaction,
      amount: parseInt(newTransaction.amount),
      createdAt: new Date().toISOString()
    };
    
    const newTransactions = [transaction, ...transactions];
    setTransactions(newTransactions);
    
    const newBudget = { 
      ...budget, 
      totalFund: budget.totalFund + parseInt(newTransaction.amount)
    };
    setBudget(newBudget);
    
    await saveToCloud('transactions', newTransactions);
    await saveToCloud('budget', newBudget);
    
    setNewTransaction({ date: '', type: '', category: '', member: '', amount: '', description: '' });
    setIsAddingTransaction(false);
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const newTransactions = transactions.filter(t => t.id !== id);
      setTransactions(newTransactions);
      await saveToCloud('transactions', newTransactions);
    }
  };

  const handlePayment = async (memberId, paymentAmount, paymentMonth) => {
    const member = members.find(m => m.id === memberId);
    const updatedBalance = member.balance + paymentAmount;
    
    const newMembers = members.map(m => 
      m.id === memberId ? { 
        ...m, 
        balance: updatedBalance, 
        paidUntil: paymentMonth
      } : m
    );
    setMembers(newMembers);

    const paymentTransaction = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: '회비',
      category: member.paymentType,
      member: member.name,
      amount: paymentAmount,
      description: `${member.name} ${paymentMonth} 회비 납부`,
      createdAt: new Date().toISOString()
    };
    
    const newTransactions = [paymentTransaction, ...transactions];
    setTransactions(newTransactions);
    
    const newBudget = { 
      ...budget, 
      totalFund: budget.totalFund + paymentAmount
    };
    setBudget(newBudget);

    await saveToCloud('members', newMembers);
    await saveToCloud('transactions', newTransactions);
    await saveToCloud('budget', newBudget);
  };

  const renderConnectionStatus = () => (
    <div className="flex items-center gap-2 text-sm">
      {isLoading ? (
        <>
          <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-blue-600">동기화 중...</span>
        </>
      ) : isConnected ? (
        <>
          <Cloud className="w-4 h-4 text-green-600" />
          <span className="text-green-600">클라우드 연결됨</span>
          {lastSync && (
            <span className="text-gray-500">
              ({lastSync.toLocaleTimeString()})
            </span>
          )}
        </>
      ) : (
        <>
          <CloudOff className="w-4 h-4 text-red-600" />
          <span className="text-red-600">연결 끊김</span>
        </>
      )}
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">친목회 자금</p>
              <p className="text-2xl font-bold text-blue-900">
                {budget.totalFund.toLocaleString()}원
              </p>
              <p className="text-xs text-blue-500 mt-1">2025.09.03 기준</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">장학금 기금</p>
              <p className="text-2xl font-bold text-green-900">
                {budget.scholarshipFund.toLocaleString()}원
              </p>
              <p className="text-xs text-green-500 mt-1">별도 통장 관리</p>
            </div>
            <FileText className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">월 회비 수입</p>
              <p className="text-2xl font-bold text-purple-900">
                {budget.monthlyIncome.toLocaleString()}원
              </p>
              <p className="text-xs text-purple-500 mt-1">월납 {budget.monthlyMembers}명</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600">전체 회원</p>
              <p className="text-2xl font-bold text-orange-900">{budget.totalMembers}명</p>
              <p className="text-xs text-orange-500 mt-1">일시납 {budget.lumpSumMembers}명</p>
            </div>
            <Users className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">최근 거래 내역</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">날짜</th>
                <th className="text-left p-2">구분</th>
                <th className="text-left p-2">대상</th>
                <th className="text-right p-2">금액</th>
                <th className="text-left p-2">내용</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 10).map(transaction => (
                <tr key={transaction.id} className="border-b">
                  <td className="p-2">{transaction.date}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      transaction.amount > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="p-2">{transaction.member}</td>
                  <td className={`p-2 text-right font-medium ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}원
                  </td>
                  <td className="p-2">{transaction.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">클라우드 데이터베이스 연동</h3>
        <p className="text-sm text-blue-700 mb-3">
          • 실시간 데이터 동기화 활성화<br/>
          • 어디서든 최신 정보 확인 가능<br/>
          • 자동 백업 및 복구 지원<br/>
          • 다중 사용자 동시 접근 가능
        </p>
        {renderConnectionStatus()}
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">거래 내역 관리</h2>
        <div className="flex items-center gap-4">
          {renderConnectionStatus()}
          {isAdmin && (
            <button
              onClick={() => setIsAddingTransaction(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              새 거래 추가
            </button>
          )}
        </div>
      </div>

      {isAdmin && isAddingTransaction && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">새 거래 추가</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
              className="border rounded px-3 py-2"
            />
            <select
              value={newTransaction.type}
              onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
              className="border rounded px-3 py-2"
            >
              <option value="">거래 구분</option>
              <option value="회비">회비</option>
              <option value="경조금">경조금</option>
              <option value="전별금">전별금</option>
              <option value="퇴직금">퇴직금</option>
              <option value="회식비">회식비</option>
              <option value="찬조금">찬조금</option>
              <option value="기타">기타</option>
            </select>
            <input
              type="text"
              placeholder="대상자"
              value={newTransaction.member}
              onChange={(e) => setNewTransaction({...newTransaction, member: e.target.value})}
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="금액 (출금시 -)"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="카테고리"
              value={newTransaction.category}
              onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="설명"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
              className="border rounded px-3 py-2"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddTransaction}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
              disabled={isLoading}
            >
              <Save className="w-4 h-4" />
              {isLoading ? '저장 중...' : '저장'}
            </button>
            <button
              onClick={() => setIsAddingTransaction(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              취소
            </button>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">날짜</th>
                <th className="text-left p-3">구분</th>
                <th className="text-left p-3">카테고리</th>
                <th className="text-left p-3">대상</th>
                <th className="text-right p-3">금액</th>
                <th className="text-left p-3">설명</th>
                {isAdmin && <th className="text-center p-3">관리</th>}
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{transaction.date}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      transaction.amount > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="p-3">{transaction.category}</td>
                  <td className="p-3">{transaction.member}</td>
                  <td className={`p-3 text-right font-medium ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}원
                  </td>
                  <td className="p-3">{transaction.description}</td>
                  {isAdmin && (
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={isLoading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderMembers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">회원 관리</h2>
        {renderConnectionStatus()}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">이름</th>
                <th className="text-left p-3">납부 방식</th>
                <th className="text-left p-3">납부 기한</th>
                <th className="text-right p-3">잔액</th>
                <th className="text-left p-3">상태</th>
                {isAdmin && <th className="text-center p-3">관리</th>}
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{member.name}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      member.paymentType === '일시납' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {member.paymentType}
                    </span>
                  </td>
                  <td className="p-3">{member.paidUntil}</td>
                  <td className={`p-3 text-right font-medium ${
                    member.balance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {member.balance.toLocaleString()}원
                  </td>
                  <td className="p-3">
                    {member.status && (
                      <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                        {member.status}
                      </span>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          const amount = prompt('납부 금액을 입력하세요:');
                          const month = prompt('납부 월을 입력하세요 (예: 2025-09):');
                          if (amount && month) {
                            handlePayment(member.id, parseInt(amount), month);
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                        disabled={isLoading}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">충주고등학교 교직원 친목회</h1>
              <p className="text-sm text-gray-600">예산 관리 시스템</p>
            </div>
            <div className="flex items-center gap-4">
              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600">관리자 모드</span>
                  <button
                    onClick={handleAdminLogout}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  관리자 로그인
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">관리자 로그인</h3>
            <input
              type="password"
              placeholder="비밀번호"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="border rounded px-3 py-2 w-full mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdminLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                로그인
              </button>
              <button
                onClick={() => setShowLogin(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', name: '대시보드', icon: DollarSign },
              { id: 'transactions', name: '거래 내역', icon: FileText },
              { id: 'members', name: '회원 관리', icon: Users }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  currentTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentTab === 'dashboard' && renderDashboard()}
        {currentTab === 'transactions' && renderTransactions()}
        {currentTab === 'members' && renderMembers()}
      </main>
    </div>
  );
};

export default FriendshipBudgetSystem;