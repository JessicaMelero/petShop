App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Verificamos que estamos usando navegadores modernos
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Respuesta de acceso aprobado
        await window.ethereum.enable();
      } catch (error) {
        // Respuesta de acceso denegado
        console.error("User denied account access");
      }
    }
    // Sino, obtenemos el proveedor del navagador antiguo
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // Si no detecta una instancia de web3, vuelve a Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Adoption.json', function(data) {
      // Obtiene el archivo de artefacto necesario y lo instancia  con truffle-contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);
      // Configuramos el proveedor de nuestro contrato
      App.contracts.Adoption.setProvider(App.web3Provider);
      // Usa nuestro contrato para devolver y marcar las mascotas adoptadas
      return App.markAdopted();
    })

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    // Declaración de la variable
    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;
      // El uso de call nos permite leer datos de la cadena de bloques sin gastar éters
      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      // Buscamos si hay alguna direccion almacena en la mascota
      for (i=0; i<adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          // Si la encontramos deshabilitamos el boton de adoptar y cambiamos el texto a 'Exitoso'
          $('.panel-pet').eq(i).find('button').text('Success').atrr('disabled', true);
        }
      }
      // Si hay algun erro se mostrará por consola
    }).catch(function(err) {
      console.log(err.message);
    })
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;
    // Obtenemos las cuentas de los usuarios
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      // Obtenemos el contrato desplegado
      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
        // Ejecuta adopt como una transaccion de la cuenta
        return adoptionInstance.adopt(petId, {from: account});
        // Si no hay errores, llamamos a markAdopted() para sincronizar la 
        // interfaz de usuario con los datos recién almacenados
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      })
    })
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
