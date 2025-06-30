import { TamaguiProvider, Text, YStack, XStack, Button } from 'tamagui'
import config from '../tamagui.config'
import { AuthProvider } from '@/utils/AuthContext'
import { Drawer } from 'expo-router/drawer'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { useAuth } from "@/utils/AuthContext";
import { Link, usePathname } from 'expo-router'

const getHeaderTitle = () => {
    const pathname = usePathname()

    let title = 'My App'

    if (pathname === '/') {
        title = 'Home'
    } else if (pathname === '/blogs') {
        title = 'Blogs'
    }
    // /blogs/:bid
    else if (/^\/blogs\/[^/]+$/.test(pathname)) {
        title = 'Blog Details'
    }
    // /blogs/:bid/posts
    else if (/^\/blogs\/[^/]+\/posts$/.test(pathname)) {
        title = 'Posts'
    }
    // /blogs/:bid/posts/:pid
    else if (/^\/blogs\/[^/]+\/posts\/[^/]+$/.test(pathname)) {
        title = 'Post Details'
    }
    else if (pathname === '/profile') {
        title = 'Profile'
    } else if (pathname === '/login') {
        title = 'Login'
    } else if (pathname === '/register') {
        title = 'Register'
    }

    return title
};


function CustomDrawerContent(props: any) {
    const { user, signOut } = useAuth();

    return (
        <DrawerContentScrollView {...props}>
            <YStack p="$4" gap="$2">
                <Text fontSize="$6" fontWeight="700">My App</Text>

                {/* Static links */}
                <Link href="/" asChild>
                    <Button variant="outlined">Home</Button>
                </Link>

                <Link href="/blogs" asChild>
                    <Button variant="outlined">Blogs</Button>
                </Link>

                {!user && (
                    <>
                        {/* Auth actions */}
                        <Link href="/login" asChild>
                            <Button variant="outlined" color="$red10">Login</Button>
                        </Link>

                        <Link href="/register" asChild>
                            <Button variant="outlined" color="$red10">Register</Button>
                        </Link>
                    </>
                )}
                {user && (
                    <>
                        <Text>Welcome: {user.username}</Text>
                        <Text onPress={signOut}>Logout</Text>
                    </>
                )}
            </YStack>
        </DrawerContentScrollView>
    )
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <TamaguiProvider config={config}>
                <Drawer
                    screenOptions={{
                        swipeEnabled: true,
                        headerShown: true,
                        headerTitle: getHeaderTitle(),
                    }}
                    drawerContent={(props) => <CustomDrawerContent {...props} />}
                >
                    {children}
                </Drawer>
            </TamaguiProvider>
        </AuthProvider>
    )
}
