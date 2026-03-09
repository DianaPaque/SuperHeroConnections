import FavoritesComponent from "@/src/components/FavoritesComponent/FavoritesComponent"
import { SafeAreaView } from "react-native-safe-area-context"

export default function FavoritesScreen() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
            <FavoritesComponent />
        </SafeAreaView>
    )
}