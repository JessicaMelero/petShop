pragma solidity ^0.5.0;

// Aserciones necesarias para testear
import "truffle/Assert.sol";
// Implementa una nueva instancia del contrato
import "truffle/DeployedAddresses.sol";
// Importación del contrato a testear
import "../contracts/Adoption.sol";

contract TestAdoption {
    // Direccion de la adopcion del contrato que va a ser testeada
    Adoption adoption = Adoption(DeployedAddresses.Adoption());
    // Id de la mascota que usará para testear
    uint expectedPetId = 8;
    // El dueño de la mascota adoptada en este contrato
    address expectedAdopter = address(this);

    // Testeo para la funcion adopt()
    function testUserCanAdoptPet() public {
        // Llamada al contrato con el ID
        uint returnId = adoption.adopt(expectedPetId);
        // Pasamos el valor real, el valor esperado y el msg de error
        Assert.equal(returnId, expectedPetId, "Adoption of the expected pet should match what is return");
    }
    // Testeo para recuperar el dueño de una mascota
    function testGetAdopterAddressByPetId() public {
        // Almacena el la direccion del adoptante
        address adopter = adoption.adopters(expectedPetId);
        // Confirma la igualdad de direcciones
        Assert.equal(adopter, expectedAdopter, "Owner of the expected pet shoul be this contract");
    }
    // Testeo para recuperar todos los dueños de las mascotas
    function testGetAdopterAddressByPetIdInArray() public {
        // Almacenmiento de mascotas adoptadas en memoria
        address[16] memory adopters = adoption.getAdopters();
        // Confirma la igualdad de las direcciones
        Assert.equal(adopters[expectedPetId], expectedAdopter, "Owner of the expected pet should be this contract");
    }
}