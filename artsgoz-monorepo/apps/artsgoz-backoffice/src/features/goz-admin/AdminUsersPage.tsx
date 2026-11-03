import { useState } from 'react';
import { Search, UserPlus, MoreHorizontal, ShieldCheck, User } from 'lucide-react';
import { GozAdminLayout } from './GozAdminLayout';

interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Member' | 'Editor';
  status: 'Active' | 'Inactive';
  lastActive: string;
}

const INITIAL_USERS: UserRecord[] = [
  {
    id: 1,
    name: 'Nanthanit Vareerak',
    email: 'nanthanit@arts.chula.ac.th',
    role: 'Admin',
    status: 'Active',
    lastActive: 'ออนไลน์เมื่อ 10 นาทีที่แล้ว',
  },
  {
    id: 2,
    name: 'Somchai Jaidee',
    email: 'somchai@arts.chula.ac.th',
    role: 'Editor',
    status: 'Active',
    lastActive: 'เมื่อวานนี้',
  },
  {
    id: 3,
    name: 'Kanda Woo',
    email: 'kanda.woo@arts.chula.ac.th',
    role: 'Member',
    status: 'Active',
    lastActive: '3 วันที่แล้ว',
  },
  {
    id: 4,
    name: 'Piti Suksabai',
    email: 'piti.s@arts.chula.ac.th',
    role: 'Member',
    status: 'Inactive',
    lastActive: '2 สัปดาห์ที่แล้ว',
  },
];

export function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users] = useState<UserRecord[]>(INITIAL_USERS);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <GozAdminLayout showTopSearch={false}>
      <div className="w-full max-w-[1240px] mx-auto flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-[#1A1C1C] font-bold text-[32px] m-0"
              style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
            >
              User Management
            </h1>
            <p
              className="text-[#8B8B8C] text-[14px] m-0 mt-0.5"
              style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
            >
              จัดการบัญชีผู้ดูแลระบบและสมาชิกในสังกัด
            </p>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#DE5D8F] hover:bg-[#CA5582] text-white font-bold text-[14px] border-none cursor-pointer transition-colors shadow-xs active:scale-95"
            style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
          >
            <UserPlus size={16} />
            <span>เพิ่มผู้ใช้ใหม่</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-[16px] p-4 border border-[#DFDFE0] shadow-xs">
          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อ หรืออีเมล..."
              className="w-full h-11 pl-4 pr-11 rounded-[10px] border border-[#DFDFE0] bg-[#FAFAFA] text-[#1A1C1C] text-[15px] outline-none transition-colors focus:bg-white focus:border-[#DE5D8F]"
              style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
            />
            <Search
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B8B8C] pointer-events-none"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-[16px] border border-[#DFDFE0] overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F8F9] border-b border-[#DFDFE0] text-[#1A1C1C] text-[15px] font-bold" style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}>
                <th className="py-3.5 px-5">ผู้ใช้งาน</th>
                <th className="py-3.5 px-4">บทบาท (Role)</th>
                <th className="py-3.5 px-4">สถานะ</th>
                <th className="py-3.5 px-4">กิจกรรมล่าสุด</th>
                <th className="py-3.5 px-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0F0]">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#FAFAFA] transition-colors text-[14px]">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#FCEFF4] flex items-center justify-center text-[#DE5D8F] font-bold">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-[#1A1C1C] m-0" style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}>
                          {u.name}
                        </p>
                        <span className="text-[#8B8B8C] text-[12px] font-mono">
                          {u.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 font-bold text-[#545455]">
                      {u.role === 'Admin' && <ShieldCheck size={15} color="#DE5D8F" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[12px] font-bold ${
                        u.status === 'Active'
                          ? 'text-[#137333] bg-[#E6F4EA]'
                          : 'text-[#8B8B8C] bg-[#F0F0F0]'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#8B8B8C]" style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}>
                    {u.lastActive}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      className="border-none bg-transparent cursor-pointer text-[#8B8B8C] hover:text-[#1A1C1C] p-1"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </GozAdminLayout>
  );
}
export default AdminUsersPage;
