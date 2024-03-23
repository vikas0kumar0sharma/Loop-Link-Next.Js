import UserCard from "@/components/cards/UserCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Fetch Users
  const result = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
  });

  return (
    <>
      <h1 className="head-text mb-10">Search</h1>

      <div className="flex items-center space-x-2" style={{marginBottom:50}}>
        <Input type="text" className="px-3 py-2 w-full" placeholder="Search..." />
        <Button className="px-3 py-2">Search</Button>
      </div>

      <div>
        {result.users.length === 0 ? (
          <p className="no-result">No Users Found</p>
        ) : (
          <>
            {result.users.map((person) => {
              return (
                <UserCard
                  key={person.id}
                  id={person.id}
                  name={person.name}
                  username={person.username}
                  imgUrl={person.image}
                  personType="User"
                />
              );
            })}
          </>
        )}
      </div>
    </>
  );
}
