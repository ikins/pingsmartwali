/*
** PingSmart wali
** Bandung 1 Jan 2019
*/

var appwali =  angular.module('app', ['onsen','ipCookie','highcharts-ng','ngRoute','angular-md5','angular-loading-bar']);


//server
var _URL        = "http://smartschool.trilogi-solution.com/api/";
var BASE_URL        = "http://smartschool.trilogi-solution.com";

//local
//var _URL        = "http://localhost:7777/apismart/api/";
//var BASE_URL        = "http://localhost:7777/apismart";


var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        //var Permission = window.plugins.Permission;
    },
    receivedEvent: function(id) {

        member_id_wali  = window.localStorage.getItem("member_id_wali");
        token_wali     = window.localStorage.getItem("token_wali");

            if (member_id_wali == '' || member_id_wali == null || token_wali == '' || token_wali == null) {
                fn.load('landing-page.html');
                return false;
            } else {
                fn.load('dashboard.html');
            }
    }
};

//config loading bar
appwali.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.latencyThreshold = 400;
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.includeBar = true;
  }]);

appwali.controller('getCurrentInfoWeek', ['$scope', '$http','ipCookie', function($scope, $http,ipCookie) {

    //Data Msg
    $scope.data = {
           msg: ''
    };

    //Date 
    $scope.date = new Date();

    $scope.logout = function(){
        window.localStorage.removeItem("member_id_wali");
        window.localStorage.removeItem("token_wali");
        window.localStorage.removeItem("level");
        window.localStorage.removeItem("nama");
        window.localStorage.removeItem("jumsiswa");
        window.localStorage.removeItem("NIS");

        fn.load('landing-page.html');
    };

    $scope.refresh = function(){
        fn.load('dashboard.html');
    };

}]);


appwali.controller('PageController', ['$scope', '$http','ipCookie', 'md5', function($scope, $http, ipCookie, md5) {


    $scope.login = function(){

        function login_action() {
        
        //var device_id = device.uuid;
        var device_id = '12345678';

        var username = $scope.username;
        var password = $scope.password;


             $http.get( _URL+"auth-wali?user=" + username + "&pass=" + password)
             .success(function (response) {
                 if (response.response_code == 1) {

                    window.localStorage.setItem("member_id_wali", response.data[0].MemberId);
                    window.localStorage.setItem("token_wali", response.data[0].Token);
                    window.localStorage.setItem("level", response.data[0].Level);
                    window.localStorage.setItem("nama", response.data[0].Nama);
                    window.localStorage.setItem("jumsiswa", response.data[0].JumSiswa);

                    JumSiswa = response.data[0].JumSiswa;

                    if (JumSiswa == 1) {

                          token_wali  = window.localStorage.getItem("token_wali");

                          $http.get( _URL+"show-my-child?token=" + token_wali)
                              .success(function (response) {

                              //---------------------SAVE LOCAL-----------------------
                              window.localStorage.setItem("NIS", response.data[0].NIS);

                              fn.load('dashboard.html');

                          });

                        }

                    fn.load('dashboard.html');

                 } else if (response.response_code != 1) {
                    ons.notification.alert({
                      messageHTML: 'Username dan password yang anda kirimkan salah.',
                      title: 'Notifikasi',
                      buttonLabel: 'OK',
                      animation: 'default',
                      callback: function() {
                        // Alert button is closed!
                      }
                    });
                    return false;
                 }
             });

        }


        if ( $scope.username == undefined ) {
                ons.notification.alert({
                  messageHTML: 'Username Harus Diisi',
                  title: 'Notifikasi',
                  buttonLabel: 'OK',
                  animation: 'default', // or 'none'
                  // modifier: 'optional-modifier'
                  callback: function() {
                    // Alert button is closed!
                  }
                });
                
                return false;
            }

        if ( $scope.password == undefined ) {
                ons.notification.alert({
                  messageHTML: 'Password Harus Diisi',
                  title: 'Notifikasi',
                  buttonLabel: 'OK',
                  animation: 'default', // or 'none'
                  // modifier: 'optional-modifier'
                  callback: function() {
                    // Alert button is closed!
                  }
                });
                
                return false;
            }


        login_action();


    };


}]);

appwali.controller('PageDashboard', ['$scope', '$http', function($scope, $http) {

  token_wali  = window.localStorage.getItem("token_wali");
  level  = window.localStorage.getItem("level");
  nama  = window.localStorage.getItem("nama");
  jumsiswa  = window.localStorage.getItem("jumsiswa");
  NIS  = window.localStorage.getItem("NIS");

  $scope.NIS = NIS;
  $scope.Nama = nama;
  $scope.Level = level;
  $scope.JumSiswa = jumsiswa;
  $scope.BASE_URL = BASE_URL;

  token_wali  = window.localStorage.getItem("token_wali");

  if(jumsiswa == 1) {

  $http.get( _URL+"siswa-profile-wali?nis=" + NIS + "&token=" + token_wali)
      .success(function (response) {

        $scope.Point = response.data[0].Point;
        $scope.Pelajaran = response.data[0].Pelajaran;
        $scope.JamPel = response.data[0].JamPel;
        //---------------------------------
        $scope.NISN = response.data[0].NISN;
        $scope.NamaSiswa = response.data[0].NamaSiswa;
        $scope.Kelas = response.data[0].Kelas;
        $scope.Lahir = response.data[0].Lahir;
        $scope.TglLahir = response.data[0].TglLahir;
        $scope.Agama = response.data[0].Agama;
        $scope.JumlahSiswa = response.data[0].JumlahSiswa;
        $scope.Rangking = response.data[0].Rangking;
        $scope.Avatar = response.data[0].Avatar;
        //--------------------------------
        $scope.URL_Avatar = BASE_URL + "/" + $scope.Avatar;

  });

}else{

  $http.get( _URL+"show-my-child?token=" + token_wali)
        .success(function (response) {

          $scope.list_siswa = response.data;
    });

}
//------End
}]);

appwali.controller('PageDashboardSiswa', ['$scope', '$http', function($scope, $http) {

  token_wali  = window.localStorage.getItem("token_wali");
  nis_siswa   = $scope.data.msg;
  
  $scope.NIS = nis_siswa;
  $scope.Nama = nama;
  $scope.Level = level;
  $scope.JumSiswa = jumsiswa;
  $scope.BASE_URL = BASE_URL;

  $http.get( _URL+"siswa-profile-wali?nis=" + nis_siswa + "&token=" + token_wali)
      .success(function (response) {

        $scope.Point = response.data[0].Point;
        $scope.Pelajaran = response.data[0].Pelajaran;
        $scope.JamPel = response.data[0].JamPel;
        //---------------------------------
        $scope.NISN = response.data[0].NISN;
        $scope.NamaSiswa = response.data[0].NamaSiswa;
        $scope.Kelas = response.data[0].Kelas;
        $scope.Lahir = response.data[0].Lahir;
        $scope.TglLahir = response.data[0].TglLahir;
        $scope.Agama = response.data[0].Agama;
        $scope.JumlahSiswa = response.data[0].JumlahSiswa;
        $scope.Rangking = response.data[0].Rangking;
        $scope.Avatar = response.data[0].Avatar;
        //--------------------------------
        $scope.URL_Avatar = BASE_URL + "/" + $scope.Avatar;

  });

}]);

appwali.controller('PageJadwal', ['$scope', '$http', function($scope, $http) {

    token_wali  = window.localStorage.getItem("token_wali");
    nis_siswa  = $scope.data.msg;

    $http.get( _URL+"siswa-jadwalwali?nis=" + nis_siswa + "&token=" + token_wali)
        .success(function (response) {

        $scope.list_jadwal = response.data;

    });

}]);

appwali.controller('PageNilaiUlangan', ['$scope', '$http', function($scope, $http) {

    token_wali  = window.localStorage.getItem("token_wali");
    nis_siswa  = $scope.data.msg;

    $http.get( _URL+"siswa-nilai-ulanganwali?nis=" + nis_siswa + "&token=" + token_wali)
        .success(function (response) {

        $scope.list_nilai_ulangan = response.data;

    });

    this.showDialog = function(Id) {
      if (this.dialog) {
        this.dialog.show();
      } else {
        
        $scope.Id = Id;
        ons.createElement('detail-nilai-ulangan.html', { parentScope: $scope, append: true })
          .then(function(dialog) {
            this.dialog = dialog;
            dialog.show();
          }.bind(this));
      }
    }.bind(this);

}]);

appwali.controller('PageAgenda', ['$scope', '$http', function($scope, $http) {

    token_wali  = window.localStorage.getItem("token_wali");
    nis_siswa  = $scope.data.msg;

    $http.get( _URL+"siswa-agenda-wali?nis=" + nis_siswa + "&token=" + token_wali)
        .success(function (response) {

        $scope.list_agenda = response.data;

    });

}]);

appwali.controller('PageAkademik', ['$scope', '$http', function($scope, $http) {

    token_wali  = window.localStorage.getItem("token_wali");
    nis_siswa  = $scope.data.msg;

    $http.get( _URL+"siswa-akademik?token=" + token_wali)
        .success(function (response) {

        $scope.list_akademik = response.data;

    });

}]);

appwali.controller('PagePengumuman', ['$scope', '$http', function($scope, $http) {

    token_wali  = window.localStorage.getItem("token_wali");
    nis_siswa  = $scope.data.msg;

    $http.get( _URL+"siswa-pengumuman-wali?nis=" + nis_siswa + "&token=" + token_wali)
        .success(function (response) {

        $scope.list_pengumuman = response.data;

    });

}]);

appwali.controller('PageAlbum', ['$scope', '$http', function($scope, $http) {

    token_wali  = window.localStorage.getItem("token_wali");
    nis_siswa  = $scope.data.msg;

    $http.get( _URL+"siswa-album-wali?nis=" + nis_siswa + "&token=" + token_wali)
        .success(function (response) {

        $scope.list_album = response.data;

    });

}]);  

appwali.controller('PagePelanggaran', ['$scope', '$http', function($scope, $http) {

    token_wali  = window.localStorage.getItem("token_wali");
    nis_siswa  = $scope.data.msg;

    $http.get( _URL+"siswa-pelanggaran-wali?nis=" + nis_siswa + "&token=" + token_wali)
        .success(function (response) {

        $scope.list_pelanggaran = response.data;

    });

}]);

//--------------------------------------------------------------------LINK------------------------------------------

window.fn = {};

window.fn.open = function() {
  var menu = document.getElementById('menu');
  menu.open();
};

window.fn.load = function(page, anim) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};

app.initialize();