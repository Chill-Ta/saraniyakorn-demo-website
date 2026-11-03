import { useState, useMemo } from 'react';
import {
  Download,
  ChevronDown,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { GozAdminLayout } from './GozAdminLayout';

interface AuditLogEntry {
  id: string;
  logId: string;
  user: string;
  role: 'Admin' | 'User';
  action: string;
  timestamp: string;
  ipDevice: string;
  status: 'Approved' | 'Denied' | 'Pending';
}

const AUDIT_LOG_DATA: AuditLogEntry[] = [
  {
    id: '1',
    logId: '1234567890',
    user: 'Shirt Nanthanit',
    role: 'Admin',
    action: 'Imported 30GB viruses',
    timestamp: '20/06/2026, 11.26 pm',
    ipDevice: 'IP/Device',
    status: 'Approved',
  },
  {
    id: '2',
    logId: '1234567890',
    user: 'Shirt Nanthanit',
    role: 'Admin',
    action: 'Imported 30GB viruses',
    timestamp: '20/06/2026',
    ipDevice: 'IP/Device',
    status: 'Denied',
  },
  {
    id: '3',
    logId: '1234567890',
    user: 'Triple T',
    role: 'User',
    action: 'Call Shirt',
    timestamp: '20/06/2026',
    ipDevice: 'IP/Device',
    status: 'Approved',
  },
  {
    id: '4',
    logId: '1234567890',
    user: 'Angelic Tungs',
    role: 'User',
    action: 'Call Shirt',
    timestamp: '20/06/2026',
    ipDevice: 'IP/Device',
    status: 'Denied',
  },
  {
    id: '5',
    logId: '1234567890',
    user: 'Shirt Nanthanit',
    role: 'Admin',
    action: 'Approved Yellow Card',
    timestamp: '20/06/2026',
    ipDevice: 'IP/Device',
    status: 'Approved',
  },
  {
    id: '6',
    logId: '1234567890',
    user: 'Shirt Nanthanit',
    role: 'Admin',
    action: 'Approved Yellow Card',
    timestamp: '20/06/2026',
    ipDevice: 'IP/Device',
    status: 'Approved',
  },
  {
    id: '7',
    logId: '1234567890',
    user: 'Shirt Nanthanit',
    role: 'Admin',
    action: 'Approved Yellow Card',
    timestamp: '20/06/2026',
    ipDevice: 'IP/Device',
    status: 'Approved',
  },
  {
    id: '8',
    logId: '1234567890',
    user: 'Shirt Nanthanit',
    role: 'Admin',
    action: 'Approved Yellow Card',
    timestamp: '20/06/2026',
    ipDevice: 'IP/Device',
    status: 'Approved',
  },
  {
    id: '9',
    logId: '1234567890',
    user: 'Shirt Nanthanit',
    role: 'Admin',
    action: 'Approved Yellow Card',
    timestamp: '20/06/2026',
    ipDevice: 'IP/Device',
    status: 'Approved',
  },
  {
    id: '10',
    logId: '1234567890',
    user: 'Shirt Nanthanit',
    role: 'Admin',
    action: 'Approved Yellow Card',
    timestamp: '20/06/2026',
    ipDevice: 'IP/Device',
    status: 'Pending',
  },
  {
    id: '11',
    logId: '1234567890',
    user: 'Shirt Nanthanit',
    role: 'Admin',
    action: 'Approved Yellow Card',
    timestamp: '20/06/2026',
    ipDevice: 'IP/Device',
    status: 'Pending',
  },
  {
    id: '12',
    logId: '1234567890',
    user: 'Shirt Nanthanit',
    role: 'Admin',
    action: 'Approved Yellow Card',
    timestamp: '20/06/2026',
    ipDevice: 'IP/Device',
    status: 'Pending',
  },
];

export function AdminAuditLogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('กิจกรรมล่าสุด');
  const [userFilter, setUserFilter] = useState('โดยทุกคน');
  const [actionFilter, setActionFilter] = useState('ทุกกิจกรรม');
  const [statusFilter, setStatusFilter] = useState('ทุกสถานะ');

  // Filter options from Figma Node 7294:26328
  const dateOptions = ['30 วันล่าสุด', '15 วันล่าสุด', '7 วันล่าสุด', 'กิจกรรมล่าสุด', 'เก่าที่สุด'];
  const userOptions = ['โดยทุกคน', 'โดยแอดมิน', 'โดยผู้ใช้'];
  const actionOptions = ['ทุกกิจกรรม', 'ใบเสร็จใบฟ้า', 'อนุมัติใบเสร็จใบฟ้า', 'และอีกมากมาย'];
  const statusOptions = ['ทุกสถานะ', 'สำเร็จ', 'ถูกปฏิเสธ', 'ล้มเหลว', 'กำลังดำเนินการ'];

  const filteredLogs = useMemo(() => {
    return AUDIT_LOG_DATA.filter((log) => {
      // Search
      const matchSearch =
        !searchTerm ||
        log.logId.includes(searchTerm) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase());

      // User filter
      let matchUser = true;
      if (userFilter === 'โดยแอดมิน') matchUser = log.role === 'Admin';
      if (userFilter === 'โดยผู้ใช้') matchUser = log.role === 'User';

      // Status filter
      let matchStatus = true;
      if (statusFilter === 'สำเร็จ') matchStatus = log.status === 'Approved';
      if (statusFilter === 'ถูกปฏิเสธ') matchStatus = log.status === 'Denied';
      if (statusFilter === 'กำลังดำเนินการ') matchStatus = log.status === 'Pending';

      return matchSearch && matchUser && matchStatus;
    });
  }, [searchTerm, userFilter, statusFilter]);

  const handleExport = () => {
    alert('ส่งออกข้อมูล Audit Log สำเร็จ!');
  };

  return (
    <GozAdminLayout showTopSearch={false}>
      <div className="w-full max-w-[1240px] mx-auto flex flex-col gap-5">
        {/* Title */}
        <h1
          className="text-[#1A1C1C] font-bold text-[32px] m-0"
          style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
        >
          Audit Log
        </h1>

        {/* Filter Toolbar Container */}
        <div className="bg-white rounded-[16px] p-4 border border-[#DFDFE0] shadow-xs flex flex-col gap-3">
          {/* Top Search bar */}
          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหา"
              className="w-full h-11 pl-4 pr-11 rounded-[10px] border border-[#DFDFE0] bg-[#FAFAFA] text-[#1A1C1C] text-[15px] outline-none transition-colors focus:bg-white focus:border-[#DE5D8F]"
              style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
            />
            <Search
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B8B8C] pointer-events-none"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Dropdown 1: Date */}
              <div className="relative">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="appearance-none bg-white border border-[#DFDFE0] rounded-[8px] px-3.5 py-2 pr-8 text-[14px] text-[#1A1C1C] font-bold cursor-pointer outline-none focus:border-[#DE5D8F]"
                  style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                >
                  {dateOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8B8B8C] pointer-events-none"
                />
              </div>

              {/* Dropdown 2: User */}
              <div className="relative">
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="appearance-none bg-white border border-[#DFDFE0] rounded-[8px] px-3.5 py-2 pr-8 text-[14px] text-[#1A1C1C] font-bold cursor-pointer outline-none focus:border-[#DE5D8F]"
                  style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                >
                  {userOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8B8B8C] pointer-events-none"
                />
              </div>

              {/* Dropdown 3: Action */}
              <div className="relative">
                <select
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                  className="appearance-none bg-white border border-[#DFDFE0] rounded-[8px] px-3.5 py-2 pr-8 text-[14px] text-[#1A1C1C] font-bold cursor-pointer outline-none focus:border-[#DE5D8F]"
                  style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                >
                  {actionOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8B8B8C] pointer-events-none"
                />
              </div>

              {/* Dropdown 4: Status */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-[#DFDFE0] rounded-[8px] px-3.5 py-2 pr-8 text-[14px] text-[#1A1C1C] font-bold cursor-pointer outline-none focus:border-[#DE5D8F]"
                  style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8B8B8C] pointer-events-none"
                />
              </div>
            </div>

            {/* Export Button (Figma Node 7294:26328) */}
            <button
              type="button"
              id="btn-export-audit"
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-[8px] bg-[#F5CDDC] hover:bg-[#F0BED2] text-[#1A1C1C] font-bold text-[14px] border-none cursor-pointer transition-colors shadow-xs active:scale-95"
              style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
            >
              <Download size={15} color="#DE5D8F" strokeWidth={2.5} />
              <span>ส่งออกข้อมูล</span>
            </button>
          </div>
        </div>

        {/* Counter */}
        <div className="flex justify-end">
          <span
            className="text-[#8B8B8C] text-[13px]"
            style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
          >
            แสดงทั้งหมด {filteredLogs.length} จาก 670 รายการ
          </span>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-[16px] border border-[#DFDFE0] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" style={{ minWidth: 920 }}>
              <thead>
                <tr className="bg-[#F7F8F9] border-b border-[#DFDFE0] text-[#1A1C1C] text-[15px] font-bold" style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}>
                  <th className="py-3.5 px-5">Log ID</th>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-5">Action</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">IP/Device</th>
                  <th className="py-3.5 px-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FAFAFA] transition-colors text-[14px]">
                    <td className="py-3.5 px-5 font-mono text-[#545455]">
                      {log.logId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#1A1C1C]">
                      {log.user}
                    </td>
                    <td className="py-3.5 px-4 text-[#545455]">
                      {log.role}
                    </td>
                    <td className="py-3.5 px-5 text-[#1A1C1C]">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-4 text-[#8B8B8C]">
                      {log.timestamp}
                    </td>
                    <td className="py-3.5 px-4 text-[#8B8B8C]">
                      {log.ipDevice}
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      {log.status === 'Approved' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold text-[#137333] bg-[#E6F4EA]">
                          <CheckCircle2 size={13} strokeWidth={2.5} />
                          Approved
                        </span>
                      )}
                      {log.status === 'Denied' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold text-[#C5221F] bg-[#FCE8E6]">
                          <XCircle size={13} strokeWidth={2.5} />
                          Denied
                        </span>
                      )}
                      {log.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold text-[#B06000] bg-[#FEF7E0]">
                          <Clock size={13} strokeWidth={2.5} />
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Summary Bar */}
          <div className="p-4 border-t border-[#DFDFE0] flex items-center justify-between text-[#8B8B8C] text-[13px]" style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}>
            <span>ทั้งหมด 108 รายการ</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="w-8 h-8 rounded-full border border-[#DFDFE0] bg-white flex items-center justify-center text-[#545455] hover:bg-[#F9FAFB] cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-full border-none bg-[#DE5D8F] text-white font-bold flex items-center justify-center cursor-pointer shadow-xs"
              >
                1
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-full border border-[#DFDFE0] bg-white flex items-center justify-center text-[#545455] hover:bg-[#F9FAFB] cursor-pointer"
              >
                2
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-full border border-[#DFDFE0] bg-white flex items-center justify-center text-[#545455] hover:bg-[#F9FAFB] cursor-pointer"
              >
                3
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-full border border-[#DFDFE0] bg-white flex items-center justify-center text-[#545455] hover:bg-[#F9FAFB] cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </GozAdminLayout>
  );
}
export default AdminAuditLogPage;
