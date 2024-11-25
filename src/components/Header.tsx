'use client';

import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon, PencilIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/16/solid'

const Header = () => {
    const { data: session } = useSession()

    return (
        <div className="header border-b border-amarr-secondary -border-2 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <MagnifyingGlassIcon className="size-6 fill-white" />
                <h1 className="text-2xl font-bold">
                    Signature Tracker
                </h1>
            </div>
            <div className="flex items-center">
            <Menu>
                <MenuButton className="inline-flex items-center gap-2 rounded-md py-1.5 px-3">
                    {session?.user?.image ? (
                        <Image src={session.user.image} alt="User Avatar" width={24} height={24} className="rounded-full" />
                    ) : (
                        <UserIcon className="size-4 fill-white" />
                    )}
                    <ChevronDownIcon className="size-4 fill-white" />
                </MenuButton>

                <MenuItems
                transition
                anchor="bottom end"
                className="w-52 origin-top-right rounded-xl bg-black p-1 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3" onClick={() => { void (session ? signOut() : signIn()) }}>
                        <PencilIcon className="size-4 fill-white/30" />
                        Sign {session ? 'Out' : 'In'}
                    </button>
                </MenuItem>
                </MenuItems>
            </Menu>
            </div>
        </div>
    )
}

export default Header
