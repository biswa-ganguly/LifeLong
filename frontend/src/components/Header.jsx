import { Bell } from 'lucide-react';
import { FaAmbulance } from 'react-icons/fa';

function Header() {
  return (
    <div className="bg-[#E53935] text-white  py-2 flex items-center justify-center gap-2 text-sm font-semibold">
      <Bell className="w-4 h-4" />

      <span>
        Emergency? Call <span className="font-bold">112</span> | Suicide Helpline: <span className="font-bold">9152987821</span>
      </span>
    </div>
  );
}

export default Header;
