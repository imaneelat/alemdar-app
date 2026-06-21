import {
 StyleSheet,
 ScrollView,
 TouchableOpacity,
 useColorScheme,
 Image,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const categories = [
 { id: '1', name: 'Solar', icon: '☀️', description: 'Panels & inverters' },
 { id: '2', name: 'Electronics', icon: '💻', description: 'Daily essentials' },
 { id: '3', name: 'Arduino', icon: '🔧', description: 'Boards & modules' },
 { id: '4', name: 'Sound', icon: '🔊', description: 'Speakers & mixers' },
 { id: '5', name: 'Batteries', icon: '🔋', description: 'Power storage' },
 { id: '6', name: 'Chargers', icon: '⚡', description: 'Power adapters' },
 { id: '7', name: 'Adapters', icon: '🔌', description: 'Converters' },
 { id: '8', name: 'Lamps', icon: '💡', description: 'Lighting' },
 { id: '9', name: 'Mexxsun', icon: '🌞', description: 'Energy products' },
 { id: '10', name: 'Filament', icon: '🖨️', description: '3D printing' },
 { id: '11', name: 'TV Remotes', icon: '📺', description: 'Remote controls' },
 { id: '12', name: 'Fans', icon: '🌀', description: 'Cooling systems' },
 { id: '13', name: 'Electrical', icon: '🔌', description: 'Electrical tools' },
 { id: '14', name: 'Screwdrivers', icon: '🔩', description: 'Hand tools' },
 { id: '15', name: 'Spray & Gum', icon: '🧴', description: 'Spray & adhesive' },
];

const products = [
 { name: 'Mexxsun Solar Panel', price: '850 TL' },
 { name: 'TV Remote', price: '267 TL' },
 { name: 'Fan', price: '1500 TL' },
];

export default function TabOneScreen() {
 const colorScheme = useColorScheme();
 const isDark = colorScheme === 'dark';

 const bg        = isDark ? '#000'                  : '#f2f2f7';
 const cardBg    = isDark ? '#1c1c1e'               : '#ffffff';
 const textColor = isDark ? '#ffffff'               : '#000000';
 const subText   = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';
 const heroBg    = isDark ? '#0d1b0d'               : '#e8f5e9';
 const heroImgBg = isDark ? '#1a2e1a'               : '#c8e6c9';

 return (
   <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
     <ScrollView showsVerticalScrollIndicator={false}>

       {/* Header - always dark blue */}
       <View style={[styles.header, { backgroundColor: '#1a3a6b' }]}>
         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'transparent' }}>
           <Image
             source={{ uri: 'https://alemdarteknik.com/wp-content/uploads/2021/01/alemdar-logo.png' }}
             style={styles.logoImage}
             resizeMode="contain"
           />
           <View style={{ backgroundColor: 'transparent' }}>
             <Text style={[styles.logo, { color: '#ffffff' }]}>Alemdar Teknik</Text>
             <Text style={[styles.logoSub, { color: 'rgba(255,255,255,0.6)' }]}>Lefkoşa, KKTC</Text>
           </View>
         </View>
         <Ionicons name="cart-outline" size={26} color="#ffffff" />
       </View>

       {/* Categories */}
       <Text style={[styles.categoriesTitle, { color: textColor }]}>
         Categories
       </Text>

       <ScrollView
         horizontal
         showsHorizontalScrollIndicator={false}
         contentContainerStyle={styles.categoriesScrollContainer}
       >
         {categories.map((cat) => (
           <TouchableOpacity key={cat.id} style={[styles.categorySquare, {
             backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
             borderColor: isDark ? '#333' : '#e0e0e0',
           }]}>
             <View style={styles.categorySquareIcon}>
               <Text style={styles.categorySquareEmoji}>{cat.icon}</Text>
             </View>
             <Text style={[styles.categorySquareName, { color: textColor }]}>{cat.name}</Text>
             <Text style={[styles.categorySquareDescription, { color: subText }]}>{cat.description}</Text>
           </TouchableOpacity>
         ))}
       </ScrollView>

       {/* Hero Banner */}
       <View style={[styles.heroBanner, { backgroundColor: heroBg }]}>
         <View style={[styles.heroImageBox, { backgroundColor: heroImgBg }]}>
           <Text style={{ fontSize: 100 }}>☀️</Text>
         </View>
         <View style={[styles.heroInfo, { backgroundColor: heroBg }]}>
           <Text style={[styles.heroBadge, { color: '#f5a623' }]}>🔥 HOT DEAL</Text>
           <Text style={[styles.heroTitle, { color: textColor }]}>Mexxsun Solar Panel</Text>
           <Text style={[styles.heroSub, { color: subText }]}>200W Monocrystalline • Best Seller</Text>
           <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, backgroundColor: 'transparent' }}>
             <TouchableOpacity style={[styles.heroBtn, {
               backgroundColor: isDark ? '#fff' : '#1a3a6b',
               flex: 1, alignItems: 'center',
             }]}>
               <Text style={{ color: isDark ? '#000' : '#fff', fontWeight: '700', fontSize: 13 }}>
                 🛒 Add to Cart
               </Text>
             </TouchableOpacity>
             <TouchableOpacity style={[styles.heroBtn, {
               backgroundColor: 'transparent',
               borderWidth: 1,
               borderColor: isDark ? '#fff' : '#1a3a6b',
               flex: 1, alignItems: 'center',
             }]}>
               <Text style={{ color: isDark ? '#fff' : '#1a3a6b', fontWeight: '700', fontSize: 13 }}>
                 More info
               </Text>
             </TouchableOpacity>
           </View>
         </View>
       </View>

       {/* Best Sellers */}
       <Text style={[styles.sectionTitle, { color: textColor }]}>Best Sellers</Text>

       <ScrollView
         horizontal
         showsHorizontalScrollIndicator={false}
         contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 8 }}
       >
         {products.map((p) => (
           <View key={p.name} style={[styles.productCard, { backgroundColor: cardBg }]}>
             <View style={[styles.productImageBox, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
               <Text style={{ fontSize: 40 }}>📦</Text>
             </View>
             <Text style={[styles.productName, { color: textColor }]}>{p.name}</Text>
             <Text style={styles.productPrice}>{p.price}</Text>
             <TouchableOpacity style={styles.addBtn}>
               <Text style={styles.addBtnText}>Add to Cart</Text>
             </TouchableOpacity>
           </View>
         ))}
       </ScrollView>

       {/* Repair Banner */}
       <View style={[styles.repairBanner, {
         backgroundColor: isDark ? '#1a0a00' : '#fff3e0',
         borderColor: isDark ? 'rgba(245,166,35,0.2)' : '#f5a623',
       }]}>
         <Text style={{ fontSize: 32 }}>🔧</Text>
         <View style={{ flex: 1, backgroundColor: 'transparent' }}>
           <Text style={[styles.repairTitle, { color: textColor }]}>
             Does it run on electricity?
           </Text>
           <Text style={[styles.repairSub, { color: subText }]}>
             We fix it. Same day service.
           </Text>
         </View>
         <TouchableOpacity style={styles.callBtn}>
           <Text style={styles.callBtnText}>📞 Call</Text>
         </TouchableOpacity>
       </View>

     </ScrollView>
   </SafeAreaView>
 );
}

const styles = StyleSheet.create({
 container: { flex: 1 },

 header: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   paddingHorizontal: 16,
   paddingVertical: 14,
   marginBottom: 4,
 },
 logoImage: { width: 36, height: 36, borderRadius: 8 },
 logo:      { fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
 logoSub:   { fontSize: 10, marginTop: 1 },

 categoriesTitle: {
   fontSize: 18,
   fontWeight: '700',
   paddingTop: 16,
   paddingHorizontal: 16,
   marginBottom: 12,
 },
 categoriesScrollContainer: {
   paddingHorizontal: 16,
   paddingRight: 32,
   gap: 12,
 },
 categorySquare: {
   width: 140,
   height: 160,
   borderRadius: 16,
   borderWidth: 1,
   padding: 14,
   alignItems: 'center',
   justifyContent: 'center',
   marginRight: 12,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.06,
   shadowRadius: 6,
   elevation: 3,
 },
 categorySquareIcon: {
   width: 56,
   height: 56,
   borderRadius: 14,
   backgroundColor: '#1a3a6b',
   justifyContent: 'center',
   alignItems: 'center',
   marginBottom: 10,
 },
 categorySquareEmoji: { fontSize: 28 },
 categorySquareName: { fontSize: 14, fontWeight: '700', textAlign: 'center', marginBottom: 2 },
 categorySquareDescription: { fontSize: 10, textAlign: 'center' },

 heroBanner:   { margin: 16, borderRadius: 16, overflow: 'hidden' },
 heroImageBox: { height: 200, alignItems: 'center', justifyContent: 'center' },
 heroInfo:     { padding: 16 },
 heroBadge:    { fontSize: 11, fontWeight: '700', marginBottom: 4 },
 heroTitle:    { fontSize: 20, fontWeight: '800' },
 heroSub:      { fontSize: 12, marginTop: 2 },
 heroBtn:      { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },

 sectionTitle: {
   fontSize: 18,
   fontWeight: '700',
   paddingHorizontal: 16,
   marginBottom: 12,
   marginTop: 16,
 },
 productCard: {
   width: 140,
   borderRadius: 14,
   overflow: 'hidden',
   padding: 10,
   shadowColor: '#000',
   shadowOpacity: 0.06,
   shadowRadius: 6,
   shadowOffset: { width: 0, height: 2 },
   elevation: 2,
 },
 productImageBox: {
   height: 90,
   borderRadius: 10,
   alignItems: 'center',
   justifyContent: 'center',
   marginBottom: 8,
 },
 productName:  { fontSize: 12, fontWeight: '600', marginBottom: 4 },
 productPrice: { fontSize: 14, fontWeight: '800', color: '#f5a623', marginBottom: 8 },
 addBtn:       { backgroundColor: '#1a3a6b', borderRadius: 8, padding: 7, alignItems: 'center' },
 addBtnText:   { color: '#fff', fontSize: 11, fontWeight: '700' },

 repairBanner: {
   flexDirection: 'row',
   alignItems: 'center',
   margin: 16,
   borderRadius: 16,
   padding: 14,
   gap: 12,
   borderWidth: 1,
   marginBottom: 30,
 },
 repairTitle: { fontSize: 13, fontWeight: '700' },
 repairSub:   { fontSize: 11, marginTop: 2 },
 callBtn:     { backgroundColor: '#f5a623', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7 },
 callBtnText: { color: '#000', fontWeight: '700', fontSize: 12 },
});