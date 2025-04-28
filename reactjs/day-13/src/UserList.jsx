import { useEffect, useState } from "react";

export default function UserList() {
    let [users,setUsers] = useState([]); 
  useEffect(() => {
    
    fetch("https://680f401067c5abddd19470e8.mockapi.io/api/v1/users")
      .then((response) => response.json())
      .then((data) => {setUsers(data);console.log(data)});
  },[]);
  return (
   <>
   <div className="list-user">
    {users.map((user) => {
        return (
            <div className="user-item">
                <img className="user-item-img" src={user.avatar} alt="error image" />
                <div className="user-item-name">{user.name}</div>
            </div>
        )
    })}
   </div>
   
    </> 
  )
  
}
