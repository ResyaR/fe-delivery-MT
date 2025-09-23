import Link from 'next/link';

export default function RegisterLink() {
  return (
    <div className="w-full flex items-center justify-center gap-3 mt-8">
      <span className="text-neutral-600 text-sm sm:text-base">
        Belum Memiliki Akun?
      </span>
      <Link 
        href="/signup"
        className="text-[#39DA49] text-sm sm:text-base font-bold cursor-pointer hover:underline"
      >
        Sign Up
      </Link>
    </div>
  );
}