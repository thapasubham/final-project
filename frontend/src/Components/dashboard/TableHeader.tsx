import { useState } from "react";
import { useAuth } from "../../auth/AuthContext.tsx";
import { UserType } from "../../types/userType.ts";

type Props = {
    setFilter: (filter: string) => void;
    setOrderBy: (orderBy: string) => void;
};

function TableHeader({ setFilter, setOrderBy }: Props) {
    const [order, setOrder] = useState(false);
    const { userStatus } = useAuth();

    function handleClick(column: string) {
        setFilter(column);
        const newOrder = !order;
        setOrder(newOrder);
        setOrderBy(newOrder ? "ASC" : "DESC");
    }

    const isPrivileged = userStatus !== UserType.USER;

    return (
        <thead>
        <tr>
            <td onClick={() => handleClick("firstname")}>Firstname</td>
            <td onClick={() => handleClick("lastname")}>Lastname</td>
            <td onClick={() => handleClick("email")}>Email</td>
            <td onClick={() => handleClick("password")}>Phone</td>
            {isPrivileged && <td>Action</td>}
        </tr>
        </thead>
    );
}

export default TableHeader;
