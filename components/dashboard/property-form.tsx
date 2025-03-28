"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Upload } from "lucide-react"

interface PropertyFormProps {
  onSubmit: () => void
  onCancel: () => void
  initialData?: any
}

export function PropertyForm({ onSubmit, onCancel, initialData }: PropertyFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    price: initialData?.price || "",
    bedroomCount: initialData?.bedroomCount || "1",
    bathroomCount: initialData?.bathroomCount || "1",
    maxGuests: initialData?.maxGuests || "2",
    amenities: initialData?.amenities || [],
    images: initialData?.images || [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Here you would typically send the data to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success!",
        description: initialData ? "Property has been updated" : "New property has been created",
      })

      onSubmit()
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="flex space-x-4 border-b">
        <Button
          type="button"
          variant={activeTab === "details" ? "default" : "ghost"}
          onClick={() => setActiveTab("details")}
          className="rounded-none rounded-t-lg"
        >
          Property Details
        </Button>
        <Button
          type="button"
          variant={activeTab === "amenities" ? "default" : "ghost"}
          onClick={() => setActiveTab("amenities")}
          className="rounded-none rounded-t-lg"
        >
          Amenities
        </Button>
        <Button
          type="button"
          variant={activeTab === "photos" ? "default" : "ghost"}
          onClick={() => setActiveTab("photos")}
          className="rounded-none rounded-t-lg"
        >
          Photos
        </Button>
        <Button
          type="button"
          variant={activeTab === "pricing" ? "default" : "ghost"}
          onClick={() => setActiveTab("pricing")}
          className="rounded-none rounded-t-lg"
        >
          Pricing & Availability
        </Button>
      </div>

      {activeTab === "details" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title</Label>
              <Input
                id="title"
                placeholder="Luxury Beach House, Cozy Mountain Cabin, etc."
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your property..."
                rows={5}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, State, Country"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedroomCount">Bedrooms</Label>
                <Select value={formData.bedroomCount} onValueChange={(value) => handleChange("bedroomCount", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathroomCount">Bathrooms</Label>
                <Select value={formData.bathroomCount} onValueChange={(value) => handleChange("bathroomCount", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {["1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5+"].map((num) => (
                      <SelectItem key={num} value={num}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxGuests">Max Guests</Label>
                <Select value={formData.maxGuests} onValueChange={(value) => handleChange("maxGuests", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "amenities" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              "Wi-Fi",
              "Kitchen",
              "Free Parking",
              "Pool",
              "Hot Tub",
              "TV",
              "Air Conditioning",
              "Heating",
              "Washer",
              "Dryer",
              "Fireplace",
              "Beach Access",
              "Lake Access",
              "Mountain View",
              "Ocean View",
              "Gym",
              "BBQ Grill",
              "Patio or Balcony",
            ].map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`amenity-${amenity}`}
                  checked={formData.amenities.includes(amenity)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleChange("amenities", [...formData.amenities, amenity])
                    } else {
                      handleChange(
                        "amenities",
                        formData.amenities.filter((a: string) => a !== amenity),
                      )
                    }
                  }}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Button type="button" variant="outline" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Custom Amenity
            </Button>
          </div>
        </div>
      )}

      {activeTab === "photos" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Label>Property Photos</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Image upload placeholder cards */}
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="aspect-square relative overflow-hidden">
                  <CardContent className="p-2 h-full flex items-center justify-center border-2 border-dashed border-border rounded">
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-sm text-muted-foreground">
              Upload at least 5 photos of your property. The first photo will be the cover image.
            </div>
          </div>
        </div>
      )}

      {activeTab === "pricing" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Base Price per Night (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-3">$</span>
                <Input
                  id="price"
                  type="number"
                  placeholder="100"
                  min="0"
                  className="pl-7"
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select defaultValue="USD">
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD (C$)</SelectItem>
                  <SelectItem value="AUD">AUD (A$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-lg font-medium mb-2">Availability Calendar</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Set your property's availability calendar. Block out dates when your property is not available.
            </p>
            <div className="bg-muted/20 rounded-lg p-8 text-center">
              <p className="text-muted-foreground">Calendar integration will appear here</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update Property" : "Create Property"}
        </Button>
      </div>
    </form>
  )
}

