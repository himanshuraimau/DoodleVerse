import axios from "axios"



async function getRoom(slug:string){
  const response = await axios.get(`http://localhost:3001/room/${slug}`)
  return response.data.id;
}

const Page = async ({
  slug
}:{
  slug: string
}) => {
  const roomId = await getRoom(slug)
  return (
    <div>Page</div>
  )
}

export default Page