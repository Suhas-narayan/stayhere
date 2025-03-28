import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const recentBookings = [
  {
    id: "1",
    guest: {
      name: "John Smith",
      email: "john@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    property: "Luxury Beach Villa",
    checkIn: "Mar 15, 2025",
    checkOut: "Mar 20, 2025",
    total: "$3,250",
    status: "confirmed",
  },
  {
    id: "2",
    guest: {
      name: "Emma Johnson",
      email: "emma@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    property: "Mountain Cabin Retreat",
    checkIn: "Apr 02, 2025",
    checkOut: "Apr 06, 2025",
    total: "$1,100",
    status: "pending",
  },
  {
    id: "3",
    guest: {
      name: "Michael Chen",
      email: "michael@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    property: "City Loft",
    checkIn: "Mar 28, 2025",
    checkOut: "Mar 31, 2025",
    total: "$660",
    status: "confirmed",
  },
]

export function RecentBookings() {
  return (
    <div className="space-y-4">
      {recentBookings.map((booking) => (
        <div key={booking.id} className="flex items-center justify-between space-x-4 rounded-md border p-3">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={booking.guest.avatar} alt={booking.guest.name} />
              <AvatarFallback>{booking.guest.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{booking.guest.name}</p>
              <p className="text-xs text-muted-foreground">{booking.property}</p>
            </div>
          </div>
          <div className="hidden md:block">
            <p className="text-sm">
              {booking.checkIn} - {booking.checkOut}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{booking.total}</p>
            <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>{booking.status}</Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

