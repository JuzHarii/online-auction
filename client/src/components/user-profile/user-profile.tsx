import { useState } from "react";
import UserTab from "./user-profile-tabs";
import { ProfileData } from "./types";
import { SetAction } from "./types";
import { useForm, SubmitHandler } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const UserEditData = z.object({
  name: z.string(),
  email: z.string(),
  birthdate: z.date(),
  address: z.string()
});

type UserFormData = z.infer<typeof UserEditData>

function EditProfile( {profile, setAction} : {profile: ProfileData, setAction: SetAction} ) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [birthdate, setBirthdate] = useState<Date | null>(profile.birthdate)
  const [address, setAddress] = useState(profile.address)
  const [disable, setDisable] = useState(true)

  return(
    <div className="px-10 py-20 rounded-sm ring ring-gray-200 shadow-sm shadow-stone-300">
      {/* <div className="flex flex-col md:flex-row md:flex-wrap gap-10"> */}
      <form className="flex flex-col gap-5">
        <div className="flex flex-col md:flex-row gap-5 md:items-center w-full">
          <label htmlFor="username" className="flex-1 font-medium truncate">Username</label>
          <input
            id="username"
            disabled={disable}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-2 border-gray-300 rounded-sm p-2 flex-3 truncate"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-5 md:items-center w-full">
          <label htmlFor="email" className="flex-1 font-medium truncate">Email</label>
          <input
            id="email"
            disabled={disable}
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-gray-300 rounded-sm p-2 flex-3 truncate"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-5 md:items-center w-full">
          <label htmlFor="birthdate" className="flex-1 font-medium truncate">Birthdate</label>
          <input
            id="birthdate"
            disabled={disable}
            type="date"
            value={birthdate ? birthdate.toISOString().split("T")[0] : ""}
            onChange={(e) => setBirthdate(e.target.value ? new Date(e.target.value) : null)}
            className="border-2 border-gray-300 rounded-sm p-2 flex-3"
          />
        </div>
        {/* </div> */}
        <div className="flex flex-col md:flex-row gap-5 md:items-center w-full">
          <label htmlFor="address" className="flex-1 font-medium truncate">Address</label>
          <input
            id="address"
            disabled={disable}
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border-2 border-gray-300 rounded-sm p-2 flex-3 truncate"
          />
        </div>

        <div className="mt-10 flex flex-col md:flex-row md:mx-auto gap-5">
          {
            disable
            ? <button 
                onClick={() => setDisable(false)}
                className="
                  md:order-2
                  rounded-sm ring ring-gray-200 shadow-sm shadow-black-300 py-3 px-10
                  cursor-pointer bg-[#8D0000] text-white
                  hover:scale-101 hover:bg-[#760000] hover:shadow-md
                  transition-all duration-200 active:scale-95
                "
              >
                Edit
              </button>

            : <div className="flex flex-col md:flex-row gap-5">
                <button
                  type="submit"
                  onClick={() => {setDisable(true)}}
                  className="
                    md:order-2
                    rounded-sm ring ring-gray-200 shadow-sm shadow-black-300 py-3 px-10
                    cursor-pointer bg-[#8D0000] text-white
                    hover:scale-101 hover:bg-[#760000] hover:shadow-md
                    transition-all duration-200 active:scale-95
                  "
                >
                  Save
                </button>

                <button
                  onClick={() => setDisable(true)}
                  className="
                    md:order-2
                    rounded-sm ring ring-gray-200 shadow-sm shadow-black-300 py-3 px-10
                    cursor-pointer bg-black text-white
                    hover:scale-101 hover:bg-gray-700 hover:shadow-md
                    transition-all duration-200 active:scale-95
                  "
                >
                  Cancel
                </button>
              </div>
          }
          <button 
            onClick={() => setAction("view-tabs")}
            className="
              md:order-1
              rounded-sm ring ring-gray-200 shadow-sm shadow-black-300 py-3 px-10
              cursor-pointer bg-white
              hover:scale-101 hover:bg-gray-100 hover:shadow-md
              transition-all duration-200 active:scale-95
            "
          >
            Back
          </button>
        </div>
      </form>

    </div>
  )
}

function ChangePassword( {profile, setAction} : {profile: ProfileData, setAction: SetAction} ) {
  return(<></>)
}

function ViewTabs( {profile, setAction} : {profile: ProfileData, setAction: SetAction} ) {
  return(
    <UserTab profile={profile}/>
  )
}

export default function UserAction( {profile, action, setAction} : {profile:ProfileData, action:string, setAction: SetAction}) {
  const renderAction = () => {
    switch(action) {
      case "edit-profile" : return(<EditProfile profile={profile} setAction={setAction}/>)
      case "change-password" : return(<ChangePassword profile={profile} setAction={setAction}/>)
      case "view-tabs" : return(<ViewTabs profile={profile} setAction={setAction}/>)
      default : return <h1 className="text-3xl text-red-500">Invalid Action!</h1>;
    }
  }
  return(
    <div className="flex-3 min-w-0">
      {renderAction()}
    </div>
  )
}