import ConnectionMapComponent from "@/src/components/ConnectionMapComponent/ConnectionMapComponent"
import { SafeAreaView } from "react-native-safe-area-context"

export default function MapScreen() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
            <ConnectionMapComponent />
        </SafeAreaView>
    )
}