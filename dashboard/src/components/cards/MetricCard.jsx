import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function MetricCard({ title, value, subtitle, icon: Icon, href, gradient }) {
  return (
    <Link href={href}>
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative overflow-hidden rounded-2xl bg-[#111] border border-[#222] p-6 hover:border-[#444] transition-colors"
      >
        <div className={`absolute -right-10 -top-10 w-32 h-32 opacity-20 blur-3xl rounded-full bg-gradient-to-br ${gradient}`} />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl bg-[#1a1a1a] border border-[#333] group-hover:bg-[#222] transition-colors`}>
              <Icon className="w-6 h-6 text-gray-300 group-hover:text-white" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
          </div>
          
          <h3 className="text-gray-400 font-medium tracking-wide text-sm">{title}</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
            <span className="text-sm font-medium text-emerald-400">{subtitle}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
