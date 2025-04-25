import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';

export default function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=50')
      .then(res => res.json())
      .then(async (data) => {
        const fullData = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return await res.json();
          })
        );
        setPokemonList(fullData);
        setSelectedPokemon(fullData[0]); // seleccionamos el primero por defecto
      });
  }, []);

  // Filtrar Pokémon según nombre y tipo
  const getFilteredPokemon = () => {
    return pokemonList.filter(pokemon => {
      const matchesName = pokemon.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesType = typeFilter
        ? pokemon.types.some(t => t.type.name === typeFilter)
        : true;
      return matchesName && matchesType;
    });
  };

  return (
    <View style={styles.container}>
      {/* Zona Izquierda - Detalles del Pokémon seleccionado */}
      <View style={styles.leftPane}>
        {selectedPokemon ? (
          <>
            <Text style={styles.pokemonName}>{selectedPokemon.name.toUpperCase()}</Text>
            <Image
              source={{ uri: selectedPokemon.sprites.front_default }}
              style={styles.pokemonImage}
            />
            <Text style={styles.info}>Tipo: {selectedPokemon.types.map(t => t.type.name).join(', ')}</Text>
            <Text style={styles.info}>Altura: {selectedPokemon.height / 10} m</Text>
            <Text style={styles.info}>Peso: {selectedPokemon.weight / 10} kg</Text>
            <Text style={styles.info}>Habilidad: {selectedPokemon.abilities[0]?.ability.name}</Text>
          </>
        ) : (
          <Text style={styles.info}>Selecciona un Pokémon</Text>
        )}
      </View>

      {/* Zona Derecha - Lista de Pokémon */}
      <View style={styles.rightPane}>
      <TextInput
        placeholder="Buscar por nombre"
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
      />

      {/* Botones para filtrar por tipo */}
      <View style={styles.buttonContainer}>
        {['', 'fire', 'water', 'grass', 'electric', 'normal'].map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.button,
              typeFilter === type && styles.selectedButton,
            ]}
            onPress={() => setTypeFilter(type)}
          >
            <Text style={styles.buttonText}>{type || 'Todos'}</Text>
          </TouchableOpacity>
        ))}
      </View>
        <FlatList
          data={getFilteredPokemon()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.listItem,
                selectedPokemon?.id === item.id && styles.selectedItem,
              ]}
              onPress={() => setSelectedPokemon(item)}
            >
              <Text style={styles.pokeIndex}>#{String(item.id).padStart(3, '0')}</Text>
              <Text style={styles.pokeName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#d32f2f', // pokédex rojo
  },
  leftPane: {
    flex: 1,
    backgroundColor: '#eeeeee',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRightWidth: 4,
    borderColor: '#b71c1c',
  },
  rightPane: {
    flex: 1.2,
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  pokemonImage: {
    width: 120,
    height: 120,
    marginVertical: 20,
  },
  pokemonName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#c62828',
  },
  info: {
    fontSize: 16,
    marginTop: 8,
  },
  listItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: '#ffcdd2',
  },
  pokeIndex: {
    fontWeight: 'bold',
    width: 50,
    color: '#555',
  },
  pokeName: {
    fontSize: 16,
    color: '#222',
    textTransform: 'capitalize',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  selectedButton: {
    backgroundColor: '#c62828',
  },
  buttonText: {
    color: '#222',
    fontWeight: 'bold',
  },
});
