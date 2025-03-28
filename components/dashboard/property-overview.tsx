import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const properties = [
  {
    id: "1",
    name: "Luxury Beach Villa",
    location: "Malibu, California",
    occupancy: 92,
    earnings: "$9,825",
    bookings: 12,
    rating: 4.9,
    status: "active",
  },
  {
    id: "2",
    name: "Mountain Cabin Retreat",
    location: "Aspen, Colorado",
    occupancy: 85,
    earnings: "$7,240",
    bookings: 8,
    rating: 4.8,
    status: "active",
  },
  {
    id: "3",
    name: "Charming Cottage",
    location: "Cotswolds, UK",
    occupancy: 72,
    earnings: "$3,450",
    bookings: 5,
    rating: 4.7,
    status: "active",
  },
  {
    id: "4",
    name: "Urban Loft",
    location: "New York City, NY",
    occupancy: 88,
    earnings: "$4,048",
    bookings: 10,
    rating: 4.6,
    status: "active",
  },
  {
    id: "5",
    name: "Lakeside Cabin",
    location: "Lake Tahoe, Nevada",
    occupancy: 0,
    earnings: "$0",
    bookings: 0,
    rating: 0,
    status: "draft",
  },
]

export function PropertyOverview() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Property</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Occupancy</TableHead>
          <TableHead>Earnings</TableHead>
          <TableHead>Bookings</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {properties.map((property) => (
          <TableRow key={property.id}>
            <TableCell className="font-medium">{property.name}</TableCell>
            <TableCell>{property.location}</TableCell>
            <TableCell>{property.occupancy}%</TableCell>
            <TableCell>{property.earnings}</TableCell>
            <TableCell>{property.bookings}</TableCell>
            <TableCell>{property.rating > 0 ? property.rating.toFixed(1) : "N/A"}</TableCell>
            <TableCell>
              <Badge variant={property.status === "active" ? "default" : "outline"}>{property.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

