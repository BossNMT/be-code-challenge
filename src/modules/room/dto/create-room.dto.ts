export class CreateRoomDto {
  items: ItemsRoom[];
  type: string;
}

export interface ItemsRoom {
  id: string
  url: string
  altText: string
  products: Product[]
  index: number
}

export interface Product {
  id: string
  dotCoordinates: DotCoordinates
  href: string
  tagPosition: string
  index: number
  imageId: string
  hide: boolean
}

export interface DotCoordinates {
  x: number
  y: number
}
