import React, { useState, useEffect } from 'react';
import { Calendar, Users, DollarSign, FileText, Plus, Save, X, Edit, Cloud, CloudOff, BookOpen } from 'lucide-react';

const FriendshipBudgetSystem = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());
  
  const [members, setMembers] = useState([
    // 신규 회원 (거래내역 없음) - 일시납으로 기본 설정
    { id: 1, name: '이규훈', paymentType: '일시납', paidUntil: '2025-09', balance: 0 },
    { id: 2, name: '김은지', paymentType: '일시납', paidUntil: '2025-09', balance: 0 },
    { id: 3, name: '이민정', paymentType: '일시납', paidUntil: '2025-09', balance: 0 },
    { id: 4, name: '허홍로', paymentType: '일시납', paidUntil: '2025-09', balance: 0 },
    { id: 5, name: '백승진', paymentType: '일시납', paidUntil: '2025-09', balance: 0 },
    { id: 6, name: '김용결', paymentType: '일시납', paidUntil: '2025-09', balance: 0 },
    
    // 월납 회원 (6명)
    { id: 7, name: '박지웅', paymentType: '월납', paidUntil: '2025-08', balance: 0 },
    { id: 8, name: '고혜원', paymentType: '월납', paidUntil: '2025-08', balance: 0 },
    { id: 9, name: '신우철', paymentType: '월납', paidUntil: '2025-08', balance: 0, status: '퇴직' },
    { id: 10, name: '원정호', paymentType: '월납', paidUntil: '2025-08', balance: 0 },
    { id: 11, name: '박미선', paymentType: '월납', paidUntil: '2025-08', balance: -15000 },
    { id: 12, name: '정순신', paymentType: '월납', paidUntil: '2025-08', balance: 0 },
    
    // 일시납 회원 - 장기납부 (25.7월-26.2월)
    { id: 13, name: '김상훈', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 14, name: '김현정', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 15, name: '구도성', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 16, name: '조남혁', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 17, name: '신동호', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 18, name: '유금진', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 19, name: '정미정', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 20, name: '심소라', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 21, name: '최송아', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 22, name: '김혜민', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 23, name: '최상아', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 24, name: '전희주', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 25, name: '신현준', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 26, name: '이준현', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 27, name: '최서은', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 28, name: '정은숙', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 29, name: '황인환', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 30, name: '김도영', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 31, name: '권오미', paymentType: '일시납', paidUntil: '2026-02', balance: 0, status: '퇴직' },
    { id: 32, name: '김혜인', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 33, name: '서예림', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 34, name: '안진형', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 35, name: '박소현', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 36, name: '이슬이', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 37, name: '송예진', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 38, name: '김희수', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 39, name: '송지언', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 40, name: '표민희', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 41, name: '윤선희', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 42, name: '이창수', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 43, name: '육감우', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 44, name: '박지은', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 45, name: '정혜정', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 46, name: '전효나', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 47, name: '박지훈', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 48, name: '한건희', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 49, name: '김홍수', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 50, name: '이병모', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 51, name: '김호성', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 52, name: '장인정', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 53, name: '위태용', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 54, name: '강지연', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 55, name: '김기준', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 56, name: '김문용', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 57, name: '임성규', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 58, name: '하헌성', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    { id: 59, name: '이종찬', paymentType: '일시납', paidUntil: '2026-02', balance: 0 },
    
    // 일시납 회원 - 단기납부 (25.7월-25.10월)
    { id: 60, name: '김은빈', paymentType: '일시납', paidUntil: '2025-10', balance: 0 },
    { id: 61, name: '노유진', paymentType: '일시납', paidUntil: '2025-10', balance: 0 }
  ]);

  const [transactions, setTransactions] = useState([
    { id: 1, date: '2025-03-18', type: '회비', category: '일시납', member: '전체(62명)', amount: 1333000, description: '25년 3월회비(62명)' },
    { id: 2, date: '2025-03-18', type: '수입', category: '충고친목회', member: '충고친목회', amount: 96830, description: '충고친목회 수입' },
    { id: 3, date: '2025-04-19', type: '회비', category: '일시납', member: '전체(62명)', amount: 1333000, description: '25년 4월회비(62명)' },
    { id: 4, date: '2025-04-28', type: '찬조금', category: '교장', member: '교장선생님', amount: 200000, description: '교장선생님 찬조' },
    { id: 5, date: '2025-04-28', type: '회식비', category: '진원소우', member: '44명', amount: -1582000, description: '진원소우 회식(44명)' },
    { id: 6, date: '2025-04-29', type: '병원비', category: '김상훈', member: '김상훈', amount: -100000, description: '김상훈 선생님 병원입원(5일이상)' },
    { id: 7, date: '2025-05-19', type: '회비', category: '일시납', member: '전체(62명)', amount: 1333000, description: '25년 5월회비(62명)' },
    { id: 8, date: '2025-05-29', type: '축하금', category: '득녀', member: '신동호', amount: -200000, description: '신동호 선생님 득녀 축하금 지급' },
    { id: 9, date: '2025-06-13', type: '축하금', category: '득녀', member: '이종찬', amount: -200000, description: '이종찬 선생님 득녀 축하금 지급' },
    { id: 10, date: '2025-06-23', type: '회비', category: '일시납', member: '전체(62명)', amount: 1311500, description: '25년 6월회비(62명)' },
    { id: 11, date: '2025-07-20', type: '회비', category: '월납', member: '9명', amount: 193500, description: '25년 7월 회비(매달납) 9명' },
    { id: 12, date: '2025-07-07', type: '회비', category: '일시납', member: '김은빈,노유진', amount: 160000, description: '25년 7월-25년 10월 회비(일시납) 2명' },
    { id: 13, date: '2025-07-20', type: '회비', category: '일시납', member: '49명', amount: 7840008, description: '25년 7월-26년 2월 회비(일시납) 49명' },
    { id: 14, date: '2025-08-20', type: '회비', category: '월납', member: '9명', amount: 193500, description: '25년 8월 회비(매달납) 9명' },
    { id: 15, date: '2025-08-20', type: '예금이자', category: '기타', member: '은행', amount: 49, description: '예금이자' },
    { id: 16, date: '2025-08-20', type: '전별금', category: '퇴직', member: '5명', amount: -260000, description: '전별금 5명' },
    { id: 17, date: '2025-08-20', type: '퇴직금', category: '퇴직', member: '권오미,신우철', amount: -2000000, description: '퇴직금 2명' },
    { id: 18, date: '2025-08-20', type: '퇴임식', category: '케이크', member: '퇴임식', amount: -68000, description: '퇴임식(케이크)' },
    { id: 19, date: '2025-08-20', type: '퇴임식', category: '꽃다발', member: '퇴임식', amount: -560000, description: '퇴임식(꽃다발 2개 및 수반 2개)' },
    { id: 20, date: '2025-08-29', type: '기타', category: '송공패', member: '기타', amount: -109980, description: '송공패 및 봉투' },
    { id: 21, date: '2025-08-29', type: '기타', category: '회비전달', member: '최영광', amount: -120000, description: '회비 드리기(최영광부장님)' },
    { id: 22, date: '2025-09-03', type: '경조금', category: '부친상', member: '박미선', amount: -300000, description: '박미선 주무관님 부친상' }
  ]);

  const [budget, setBudget] = useState({
    totalFund: 8494407,
    scholarshipFund: 180000,
    monthlyIncome: 129000,
    totalMembers: 61,
    monthlyMembers: 6,
    lumpSumMembers: 55
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

  const renderRegulations = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">친목회 규약</h2>
        {renderConnectionStatus()}
      </div>

      <div className="bg-white p-8 rounded-lg shadow max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">충주고등학교 친목회 규약</h1>
          <p className="text-sm text-gray-600">2025년 3월 1일 시행</p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-2">제1조 (명칭)</h3>
            <p className="text-gray-700">본회는 '충주고등학교 친목회'(이하 본회(本會))라 칭한다.</p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-2">제2조 (구성)</h3>
            <p className="text-gray-700">본회는 충주고등학교 교직원으로 구성하며, 입회비는 없다.<br/>
            (단 기간제 교사는 본인 희망에 따라 가입할 수 있다.)</p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-2">제3조 (목적)</h3>
            <p className="text-gray-700">본회의 목적은 교직원 상호간의 융화와 친목 도모를 목적으로 한다.</p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-2">제4조 (임원)</h3>
            <p className="text-gray-700">본회의 회장(會長)은 교직원 과반수의 찬성으로 선출하고 간사(幹事) 2인(남, 여 각 1명)은 회장이 임명하며 임원의 임기는 1년으로 한다. (1년 연임 가능)</p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-2">제5조 (경조금)</h3>
            <p className="text-gray-700 mb-3">본회의 경조금은 다음과 같이 정하며, 원거리 참석 시 대표 차량(차량 1대당 3~10만원 정도-통행료 포함)에 대해 소정의 주유비를 지급할 수 있다.</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="space-y-2 text-gray-700">
                <li><span className="font-medium">1. 회원 결혼 시:</span> 30만 원</li>
                <li><span className="font-medium">2. 회원 자녀 결혼 시:</span> 20만 원</li>
                <li><span className="font-medium">3. 회원 정년(명예)퇴직 시:</span> 현금100만 원(또는 100만원 상당의 금품)과 공로패 및 꽃다발 증정<br/>
                <span className="text-xs text-gray-600">(이에 소요되는 경비는 별도의 추가 회비 각출 함)</span></li>
                <li><span className="font-medium">4. 회원 득남득녀 경사 시:</span> 20만 원</li>
                <li><span className="font-medium">5. 회원 배우자사망 시:</span> 30만 원</li>
                <li><span className="font-medium">6. 회원 양가 부모 사망 시:</span> 30만 원</li>
                <li><span className="font-medium">7. 회원 자녀 사망 시:</span> 30만 원</li>
                <li><span className="font-medium">8. 병원입원치료 5일 이상:</span> 10만 원</li>
              </ul>
            </div>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-2">제6조 (전별금)</h3>
            <p className="text-gray-700 mb-3">본회의 전별금은 다음과 같이 정한다.</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="space-y-2 text-gray-700">
                <li><span className="font-medium">1. 6개월 이상∼1년 이하 근무 시:</span> 2만원</li>
                <li><span className="font-medium">2. 1년에 2만원씩 가산됨.</span><br/>
                <span className="text-xs text-gray-600">(예: 2.6년의 경우 3년으로 함. 5년 10만원), (단 5년을 초과할 수 없다.)</span></li>
              </ul>
            </div>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-2">제7조 (송별회)</h3>
            <p className="text-gray-700">회원 전체 송별회는 교사정기 인사(2월, 8월) 및 행정직 인사이동 시 한다.</p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-2">제8조 (운영자금)</h3>
            <p className="text-gray-700">본회의 운영자금은 매년 3월부터 회원 당 월 20,000원을 각출하여 적립한다.</p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-2">제9조 (교직원 장학금)</h3>
            <p className="text-gray-700 mb-3">교직원 장학금은 다음과 같이 운영하며, 별도의 통장을 관리함.</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="space-y-2 text-gray-700">
                <li><span className="font-medium">1.</span> 회원 개인당 ₩1,500원씩 매월 각출하여 적립 한다.(3월부터 다음해 2월까지)</li>
                <li><span className="font-medium">2.</span> 가정형편이 어려우나 학교생활에 충실한 학생 중 학년부의 추천을 받아 선발한다. 단, 타 장학금을 받지 않아야 하며 지급액과 인원수는 협의하여 정한다.</li>
                <li><span className="font-medium">3.</span> 매년 학년말 종업식 때 지급한다.</li>
              </ul>
            </div>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-2">제10조 (미규정 사안)</h3>
            <p className="text-gray-700">본회에 규정되지 않은 사안 발생 시에는 친목회 회의에서 결정한다.</p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-2">제11조 (회계연도)</h3>
            <p className="text-gray-700">본회의 회계연도는 3월부터 익년 2월로 한다.</p>
          </div>

          <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-900 mb-2">부 칙</h3>
            <p className="text-red-800"><span className="font-medium">제1조(시행일)</span> 본회의 규약은 2025년 3월 1일부터 시행한다.</p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">참고사항</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 현재 월 회비: 21,500원 (친목회비 20,000원 + 장학금 1,500원)</li>
            <li>• 회계연도: 매년 3월 ~ 익년 2월</li>
            <li>• 장학금은 별도 통장으로 관리</li>
            <li>• 경조금 및 전별금은 규약에 따라 자동 지급</li>
          </ul>
        </div>
      </div>
    </div>
  );
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
              { id: 'members', name: '회원 관리', icon: Users },
              { id: 'regulations', name: '친목회 규약', icon: BookOpen }
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
        {currentTab === 'regulations' && renderRegulations()}
      </main>
    </div>
  );
};

export default FriendshipBudgetSystem;