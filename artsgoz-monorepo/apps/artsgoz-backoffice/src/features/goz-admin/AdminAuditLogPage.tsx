import { useState, useMemo, useEffect } from 'react';
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

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/$/, '');

export function AdminAuditLogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [dateFilter, setDateFilter] = useState('กิจกรรมล่าสุด');
  const [userFilter, setUserFilter] = useState('โดยทุกคน');
  const [statusFilter, setStatusFilter] = useState('ทุกสถานะ');

  const dateOptions = ['30 วันล่าสุด', '15 วันล่าสุด', '7 วันล่าสุด', 'กิจกรรมล่าสุด'];
  const userOptions = ['โดยทุกคน', 'โดยแอดมิน', 'โดยผู้ใช้'];
  const statusOptions = ['ทุกสถานะ', 'สำเร็จ', 'ถูกปฏิเสธ', 'กำลังดำเนินการ'];

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_BASE}/v1/activities?page=${page}&limit=20&search=${encodeURIComponent(searchTerm)}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer mock.jwt.admin',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          const mapped: AuditLogEntry[] = data.data.map((item: any, idx: number) => ({
            id: String(item.id || idx),
            logId: String(item.id ? item.id.substring(0, 10) : `LOG-${1000 + idx}`),
            user: item.actor_name || 'ผู้ดูแลระบบ',
            role: 'Admin',
            action: item.action || item.detail || 'ปรับปรุงข้อมูลในระบบ',
            timestamp: item.created_at
              ? new Date(item.created_at).toLocaleString('th-TH', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })
              : item.time_ago || 'เมื่อสักครู่',
            ipDevice: 'Web / Backoffice',
            status: 'Approved',
          }));
          setLogs(mapped);
          setTotalItems(data.meta?.total_items ?? mapped.length);
        } else {
          setLogs([]);
          setTotalItems(0);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch audit logs from database', err);
        setLogs([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [page, searchTerm]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // User filter
      let matchUser = true;
      if (userFilter === 'โดยแอดมิน') matchUser = log.role === 'Admin';
      if (userFilter === 'โดยผู้ใช้') matchUser = log.role === 'User';

      // Status filter
      let matchStatus = true;
      if (statusFilter === 'สำเร็จ') matchStatus = log.status === 'Approved';
      if (statusFilter === 'ถูกปฏิเสธ') matchStatus = log.status === 'Denied';
      if (statusFilter === 'กำลังดำเนินการ') matchStatus = log.status === 'Pending';

      return matchUser && matchStatus;
    });
  }, [logs, userFilter, statusFilter]);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `artsgoz_audit_log_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / 20));

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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="ค้นหากิจกรรม, รหัส Log ID, หรือผู้ใช้งาน"
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

              {/* Dropdown 3: Status */}
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

            {/* Export Button */}
            <button
              type="button"
              id="btn-export-audit"
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-[8px] bg-[#F5CDDC] hover:bg-[#F0BED2] text-[#1A1C1C] font-bold text-[14px] border-none cursor-pointer transition-colors shadow-xs active:scale-95"
              style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
            >
              <Download size={15} color="#DE5D8F" strokeWidth={2.5} />
              <span>ส่งออกข้อมูล (JSON)</span>
            </button>
          </div>
        </div>

        {/* Counter */}
        <div className="flex justify-end">
          <span
            className="text-[#8B8B8C] text-[13px]"
            style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
          >
            แสดงทั้งหมด {filteredLogs.length} จาก {totalItems} รายการ
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
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400 font-serif">
                      กำลังโหลดประวัติการทำงานจากฐานข้อมูล...
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400 font-serif">
                      ไม่พบประวัติการทำงานในระบบ
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
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
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Summary Bar */}
          <div className="p-4 border-t border-[#DFDFE0] flex items-center justify-between text-[#8B8B8C] text-[13px]" style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}>
            <span>ทั้งหมด {totalItems} รายการ</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-8 h-8 rounded-full border border-[#DFDFE0] bg-white flex items-center justify-center text-[#545455] hover:bg-[#F9FAFB] cursor-pointer disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-full border-none bg-[#DE5D8F] text-white font-bold flex items-center justify-center cursor-pointer shadow-xs"
              >
                {page}
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="w-8 h-8 rounded-full border border-[#DFDFE0] bg-white flex items-center justify-center text-[#545455] hover:bg-[#F9FAFB] cursor-pointer disabled:opacity-40"
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
