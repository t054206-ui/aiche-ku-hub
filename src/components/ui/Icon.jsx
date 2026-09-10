import {
  ArrowRight,
  ArrowUpRight,
  AtSign,
  BadgeCheck,
  BookOpen,
  Briefcase,
  CalendarDays,
  Camera,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Factory,
  FlaskConical,
  Globe,
  HeartHandshake,
  Instagram,
  Library,
  Link as LinkIcon,
  Linkedin,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Search,
  Sparkles,
  Ticket,
  Trophy,
  UserPlus,
  Users,
  Wrench,
  X,
  AlertTriangle,
  BookMarked,
  Bot,
  CalendarCheck,
  Check,
  ChevronLeft,
  CircleCheck,
  CircleDashed,
  Compass,
  Download,
  Eye,
  ExternalLink,
  FileText,
  GraduationCap,
  Info,
  Layers,
  ListChecks,
  Lock,
  MessageCircle,
  Minus,
  Plus,
  RotateCcw,
  Route,
  Send,
  SlidersHorizontal,
} from 'lucide-react'

/** WhatsApp is not in lucide, so it is drawn here in the same 24px stroke style. */
function WhatsApp(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      <path d="M9 8.5c.3 3.4 2.9 6.2 6.5 6.5l1.2-1.6-2.2-1.1-1 .9a4.6 4.6 0 0 1-2.7-2.7l.9-1L10.6 7.3Z" />
    </svg>
  )
}

/**
 * Icon registry: data files refer to icons by name so content editors never
 * touch imports. Add new lucide icons here when you need them.
 */
export const ICONS = {
  ArrowRight,
  ArrowUpRight,
  AtSign,
  BadgeCheck,
  BookOpen,
  Briefcase,
  CalendarDays,
  Camera,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Factory,
  FlaskConical,
  Globe,
  HeartHandshake,
  Instagram,
  Library,
  Link: LinkIcon,
  Linkedin,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Search,
  Sparkles,
  Ticket,
  Trophy,
  UserPlus,
  Users,
  WhatsApp,
  Wrench,
  X,
  AlertTriangle,
  BookMarked,
  Bot,
  CalendarCheck,
  Check,
  ChevronLeft,
  CircleCheck,
  CircleDashed,
  Compass,
  Download,
  Eye,
  ExternalLink,
  FileText,
  GraduationCap,
  Info,
  Layers,
  ListChecks,
  Lock,
  MessageCircle,
  Minus,
  Plus,
  RotateCcw,
  Route,
  Send,
  SlidersHorizontal,
}

export default function Icon({ name, className = 'h-5 w-5', ...props }) {
  const Component = ICONS[name] || LinkIcon
  return <Component className={className} aria-hidden="true" focusable="false" {...props} />
}
