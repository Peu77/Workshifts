import {useGetUsers} from "@/admin/usersApi";
import {Button} from "@/components/ui/button";
import {CreateShift} from "@/admin/dialog/createShift";
import {Table, TableBody, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {DialogContext} from "@/provider/DialogProvider";
import {useContext} from "react";
import {UserCell} from "@/admin/user";

export const Users = () => {
    const users = useGetUsers()
    const {setDialog} = useContext(DialogContext)

    return (
        <div>
            <Button className="" onClick={() => setDialog(<CreateShift/>)}>Create user</Button>
            {users.isLoading && <p>Loading...</p>}
            {users.isError && <p>Error</p>}
            {users.data && (
                <Table className="mt-4">
                    <TableHeader>
                        <TableRow>
                            <TableHead>name</TableHead>
                            <TableHead>email</TableHead>
                            <TableHead>actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.data.map((user) => (
                            <UserCell key={user.id} {...user}/>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}