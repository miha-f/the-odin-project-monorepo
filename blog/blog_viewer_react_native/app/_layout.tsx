import { TamaguiProvider } from 'tamagui'
import config from '../tamagui.config'
import { Drawer } from 'expo-router/drawer'

export default function Layout() {
    return (
        <TamaguiProvider config={config}>
            <Drawer
                screenOptions={{
                    headerShown: true,
                    swipeEnabled: true,
                }}
            >
                {/* Define drawer screens by file-based routes */}
            </Drawer>
        </TamaguiProvider>
    )
}

