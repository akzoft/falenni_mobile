import React, { FC } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Product, api_public, categorieDisplay, colors } from '../../../libs';
import { useNavigation } from '@react-navigation/native';


const RelatedProductCard: FC<{ product: Product, scrollViewRef: any }> = ({ product, scrollViewRef }) => {
  const navigation = useNavigation<any>()

  const handleDetails = () => {
    navigation.navigate("detail_du_produit", { product });
    scrollViewRef.current.scrollTo({ y: 0, animated: true })
  }


  return (
    <TouchableOpacity onPress={handleDetails} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.left}><Image source={{ uri: `${api_public}/images/${product?.images[0]}` }} style={styles.image} /></View>
        <View style={styles.right}>
          <Text style={styles.title}>{product?.title}</Text>
          {(product?.prix.fixe || product?.prix?.negociation) && <Text style={styles.prix}>{(product?.valeurMarchande + " fcfa")}</Text>}
          <Text style={styles.categorie}>{categorieDisplay(product?.categories, " | ")}</Text>
          {product?.conditions.troc ? <Text style={styles.type}>Produit à troquer</Text> : product?.conditions?.vendre && <Text style={styles.type}>Produit à vendre</Text>}
          <Text style={{ fontSize: 13, color: colors.main_dark }}>Offres ({product?.offres?.length})</Text>
          <View style={{ flexDirection: "row", position: "absolute", alignItems: "center", justifyContent: "space-between", bottom: 15, width: "100%" }}>
            <Text style={styles.dispo}>Disponible</Text>

            {product?.prix?.fixe ? <Text style={styles.typeprix}>Prix fixe</Text> :
              product?.prix?.negociation && <Text style={styles.typeprix}>Prix négociable</Text>
            }
          </View>
        </View>
      </View>
    </TouchableOpacity >
  );
};

const styles = StyleSheet.create({
  container: { height: 150, marginVertical: 2, borderWidth: 0.5, borderColor: colors.main_light, backgroundColor: colors.white },
  title: { fontSize: 18, color: colors.dark, letterSpacing: 1.5, fontWeight: "300", marginBottom: 5 },
  content: { flexDirection: "row", gap: 4, },
  left: { width: "40%", height: 150, borderWidth: 0.5, borderColor: colors.main_light },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  categorie: { color: colors.brown, fontSize: 8 },
  right: { position: "relative", width: "59%" },
  prix: { fontSize: 14, color: colors.warning },
  typeprix: { fontSize: 14, color: colors.dark },
  typevendre: { fontSize: 12, color: colors.dark },
  dispo: { fontSize: 13, color: colors.danger },
  type: { fontSize: 13, color: colors.dark }
});

export default RelatedProductCard;
