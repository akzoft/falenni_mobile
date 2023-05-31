import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList } from 'react-native'
import React, { useRef, useState } from 'react'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'


const Dropdown = ({ label, data, onSelect }) => {
    const [visible, setVisible] = useState(false)
    const DropdownButton = useRef();
    const [dropdownTop, setDropdownTop] = useState(0);
    const [selected, setSelected] = useState(undefined);

    // const toggle = () => { setVisible(!visible) }

    const toggle = () => {
        visible ? setVisible(false) : openDropdown();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
            <Text>{item.label}</Text>
        </TouchableOpacity>
    );

    const openDropdown = () => {
        DropdownButton.current.measure((_fx, _fy, _w, h, _px, py) => {
            setDropdownTop(py + h);
        });
        setVisible(true);
    };

    const onItemPress = (item) => {
        setSelected(item);
        onSelect(item);
        setVisible(false);
    };

    const display = () => {
        if (visible)
            return (
                <Modal visible={visible} transparent animationType="none">
                    <TouchableOpacity
                        style={styles.overlay}
                        onPress={() => setVisible(false)}
                    >
                        <View style={[styles.dropdown, { top: dropdownTop }]}>
                            <FlatList
                                data={data}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
            )
    }

    return (
        <TouchableOpacity ref={DropdownButton} style={styles.button} onPress={toggle}>
            {display()}
            <Text style={styles.buttonText}>{label}</Text>
            <FontAwesome5 name='angle-down' size={20} />
        </TouchableOpacity>
    )
}

export default Dropdown

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#efefef',
        height: 50,
        width: '90%',
        paddingHorizontal: 10,
        zIndex: 1,
    },
    buttonText: {
        flex: 1,
        textAlign: 'center',
    },
    dropdown: {
        position: 'absolute',
        backgroundColor: '#fff',
        width: '100%',
        shadowColor: '#000000',
        shadowRadius: 4,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.5,
    },
    item: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
})