export default function Header({ title }) {
  return (
    <header className="h-20 border-b border-[#1f1f1f] bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-40 flex items-center px-8">
      <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
      
      <div className="flex-1" />
    </header>
  );
}
