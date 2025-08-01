"use client";

//import { Skeleton } from "@/app/components";
import classnames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillBug } from "react-icons/ai";
//import { useSession } from "next-auth/react";
import { Container, Flex } from "@radix-ui/themes";

const NavBar = () => {
  return (
    <nav className="border-b mb-5 px-5 py-3">
      <Container>
        <Flex justify="between">
          <Flex align="center" gap="3">
            <Link href="/">
              <AiFillBug />
            </Link>
            <NavLinks />
          </Flex>
        </Flex>
      </Container>
    </nav>
  );
};

const NavLinks = () => {
  const currentPath = usePathname();

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Giao dịch", href: "/transactions/list" },
    { label: "Giá vàng", href: "/goldPrices/list" },
    { label: "Trang sức", href: "/jewelry/list" },
    { label: "Khách hàng", href: "/contacts/list" },
    { label: "Báo cáo xuất nhập tồn", href: "/reportXNTs/list" },
    { label: "Tồn kho theo tháng", href: "/inventoryReport/list" },
    { label: "DS thanh toán", href: "/payments/list" },
  ];

  return (
    <ul className="flex space-x-6">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            className={classnames({
              "nav-link": true,
              "!text-zinc-900": link.href === currentPath,
            })}
            href={link.href}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

// const AuthStatus = () => {
//   const { status, data: session } = useSession();

//   if (status === "loading") return <Skeleton width="3rem" />;

//   if (status === "unauthenticated")
//     return (
//       <Link className="nav-link" href="/api/auth/signin">
//         Login
//       </Link>
//     );

//   return (
//     <Box>
//       <DropdownMenu.Root>
//         <DropdownMenu.Trigger>
//           <Avatar
//             src={session!.user!.image!}
//             fallback="?"
//             size="2"
//             radius="full"
//             className="cursor-pointer"
//             referrerPolicy="no-referrer"
//           />
//         </DropdownMenu.Trigger>
//         <DropdownMenu.Content>
//           <DropdownMenu.Label>
//             <Text size="2">{session!.user!.email}</Text>
//           </DropdownMenu.Label>
//           <DropdownMenu.Item>
//             <Link href="/api/auth/signout">Log out</Link>
//           </DropdownMenu.Item>
//         </DropdownMenu.Content>
//       </DropdownMenu.Root>
//     </Box>
//   );
// };

export default NavBar;
