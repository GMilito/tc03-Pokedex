import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const PokemonCard = ({ pokemon }) => {
  const getTypes = () => {
    return pokemon.types.map((t) => t.type.name).join(', ');
  };

  return (
    <View style={styles.card}>
      <Image
        style={styles.image}
        source={{ uri: pokemon.sprites.front_default }}
      />
      <Text style={styles.name}>{pokemon.name.toUpperCase()}</Text>
      <Text style={styles.info}>Tipo: {getTypes()}</Text>
      <Text style={styles.info}>Altura: {pokemon.height / 10} m</Text>
      <Text style={styles.info}>Peso: {pokemon.weight / 10} kg</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 4, // para que no estén tan separadas
    width: 160, // tamaño fijo si se quiere más control
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  image: {
    width: 100,
    height: 100,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginTop: 8,
  },
  info: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
});

export default PokemonCard;
