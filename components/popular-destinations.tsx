const destinations = [
  {
    id: 1,
    name: "kuala lumpur",
    image: "/twintower.jpg?height=400&width=600",
   
  },
  {
    id: 2,
    name: "Penang",
    image: "/penang.jpg?height=400&width=600",
  
  },
  {
    id: 3,
    name: "Johor bahru",
    image: "/johor.jpg?height=400&width=600",
 
  },
  {
    id: 4,
    name: "Petaling jaya",
    image: "pet.jpg/?height=400&width=600",
 
  },
  {
    id: 5,
    name: "Kota kinabalu",
    image: "/kota.jpg?height=400&width=600",
   
  },
  {
    id: 6,
    name: "Pattaya",
    image: "/pattaya.jpg?height=400&width=600",
   
  },
]

export default function PopularDestinations() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="popular-destinations">
      {destinations.map((destination) => (
        <a
          key={destination.id}
          href={`/properties?location=${encodeURIComponent(destination.name)}`}
          className="group relative overflow-hidden rounded-xl aspect-[3/2]"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${destination.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h3 className="text-xl font-bold mb-1">{destination.name}</h3>
        
          </div>
        </a>
      ))}
    </div>
  )
}

