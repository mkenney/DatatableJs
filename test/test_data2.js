
+function(global, undefined) {
    global.mock.schema.real_world = {
        "id":      {"type": Number, "nullable": false},
        "name":    {"type": String, "nullable": false},
        "address": {"type": String},
        "city":    {"type": String},
        "state":   {"type": String},
        "zip":     {"type": String},
        "domains": {"type": Array},
        "ips":     {"type": Object},
        "active":  {"type": Boolean}
    };

    global.mock.data.real_world  =[
        {
            "id": undefined,
            "name": "3Com Corp",
            "address": "884 Bayberry Drive ",
            "city": "Londonderry",
            "state": "NH",
            "zip": "3053",
            "domains": [
                "abcusa.biz",
                "att.com",
                "octopus.com",
                "apple.com",
                "parcplace.com",
                "toad.com"
            ],
            "ips": {
                "ipv4": "107.99.176.184",
                "ipv6": "43:d63a:b3d4:1e1e:ffa:3e1d:1788:9fb6"
            },
            "active": false
        },
        {
            "id": null,
            "name": "Dow Chemical Company",
            "address": "587 Hillside Avenue ",
            "city": "Moses Lake",
            "state": "WA",
            "zip": "98837",
            "domains": [
                "agrokomerc.us",
                "gmr.com",
                "das.com",
                "nma.com",
                "trw.com",
                "sco.com"
            ],
            "ips": {
                "ipv4": "50.20.115.165",
                "ipv6": "4477:65f6:49ed:f8b8:7869:911a:64a6:68a9"
            },
            "active": false
        },
        {
            "id": "3",
            "name": "Acme Widgets",
            "address": "929 Hudson Street ",
            "city": "San Diego",
            "state": "CA",
            "zip": "92111",
            "domains": [
                "bihtrgovina.com",
                "nsc.com",
                "tti.com",
                "kai.com",
                "rosetta.com"
            ],
            "ips": {
                "ipv4": "235.100.191.132",
                "ipv6": "2a80:9604:2711:f6ba:631a:4f82:e56e:579e"
            },
            "active": true
        },
        {
            "id": 4,
            "name": ["Sanmina-SCI Inc"],
            "address": "540 Valley Road ",
            "city": "Rowlett",
            "state": "TX",
            "zip": "75088",
            "domains": [
                "eurofilmovi.com",
                "fluke.com"
            ],
            "ips": {
                "ipv4": "119.222.43.197",
                "ipv6": "732c:3846:cd3d:bcac:9ba4:f543:c4c6:21e9"
            },
            "active": false
        },
        {
            "id": 5,
            "name": "",
            "address": "409 Court Street ",
            "city": "Waldorf",
            "state": "MD",
            "zip": "20601",
            "domains": [
                "ev-inc.com",
                "gte.com"
            ],
            "ips": {
                "ipv4": "45.246.41.182",
                "ipv6": "23e7:54ca:29ea:fd6c:59ef:a51e:a647:b831"
            },
            "active": true
        },
        {
            "id": 6,
            "name": 1,
            "address": "728 Oxford Court ",
            "city": "Klamath Falls",
            "state": "OR",
            "zip": "97603",
            "domains": [
                "alliancebuildingcompany.com",
                "ub.com",
                "amd.com",
                "philips.com",
                "unipress.com"
            ],
            "ips": {
                "ipv4": "2.118.129.24",
                "ipv6": "8497:adbb:6ce:5349:498:c02e:3984:4323"
            },
            "active": false
        },
        {
            "id": 7,
            "name": "Xilinx Inc",
            "address": "144 Hillcrest Drive ",
            "city": "Champaign",
            "state": "IL",
            "zip": "61821",
            "domains": [
                "xerox.com"
            ],
            "ips": {
                "ipv4": "118.162.66.8",
                "ipv6": "5018:f8b5:b505:d9cc:abdc:df49:1a24:af66"
            },
            "active": "false"
        },
        {
            "id": 8,
            "name": "Northwest Airlines Corp",
            "address": "195 New Street ",
            "city": "West Chicago",
            "state": "IL",
            "zip": "60185",
            "domains": "eurofilmovi.org,alphadc.com",
            "ips": {
                "ipv4": "200.125.17.16",
                "ipv6": "b067:a2e9:d7b5:4ee5:22bb:83be:802b:b5b7"
            },
            "active": true
        },
        {
            "id": 9,
            "name": "Eastman Chemical Company",
            "address": "943 5th Avenue ",
            "city": "Gibsonia",
            "state": "PA",
            "zip": "15044",
            "domains": [
                "bbn.com"
            ],
            "ips": ["243.154.99.54"],
            "active": 0
        },
        {
            "id": 10,
            "name": "Martin Marietta Materials Inc.",
            "address": "470 Water Street ",
            "city": "Fullerton",
            "state": "CA",
            "zip": "92831",
            "domains": [
                "sexycura.com"
            ],
            "ips": {
                "ipv4": "67.247.178.29"
            },
            "active": 1
        },
        {
            "id": 11,
            "name": "Potlatch Corp",
            "address": "875 Pin Oak Drive ",
            "city": "Maryville",
            "state": "TN",
            "zip": "37803",
            "domains": [
                "ftasex.info",
                "intel.com"
            ],
            "ips": {
                "ipv4": "223.118.101.81",
                "ipv6": "7701:9373:d91c:dda6:b283:fec2:915f:9132"
            },
            "active": true
        },
        {
            "id": 12,
            "name": "Stilwell Financial Inc",
            "address": "200 Mill Street ",
            "city": "Burnsville",
            "state": "MN",
            "zip": "55337",
            "domains": [
                "worldfreetv.us​"
            ],
            "ips": {
                "ipv4": "190.61.183.172",
                "ipv6": "4c72:ec4b:fe84:cea:5352:3c83:bc43:705c"
            },
            "active": false
        },
        {
            "id": 13,
            "name": "IT Group Inc.",
            "address": "784 Riverside Drive ",
            "city": "Leominster",
            "state": "MA",
            "zip": "1453",
            "domains": [
                "croatiantv.us",
                "rosemount.com",
                "3com.com"
            ],
            "ips": {
                "ipv4": "0.22.25.39",
                "ipv6": "fcc0:1c42:d463:6691:cd0b:5a24:2c1:1111"
            },
            "active": false
        },
        {
            "id": 14,
            "name": "Scana Corp.",
            "address": "12 Spring Street ",
            "city": "Cumming",
            "state": "GA",
            "zip": "30040",
            "domains": [
                "mcc.com"
            ],
            "ips": {
                "ipv4": "197.222.172.61",
                "ipv6": "e940:e03:6eda:5644:e5dc:7d8:aef:350c"
            },
            "active": false
        },
        {
            "id": 15,
            "name": "Allegheny Technologies Incorporated",
            "address": "575 Strawberry Lane ",
            "city": "Glen Allen",
            "state": "VA",
            "zip": "23059",
            "domains": [
                "eurofilmovi.net",
                "bdm.com"
            ],
            "ips": {
                "ipv4": "177.204.205.51",
                "ipv6": "ffb1:95d5:81c1:7d3f:f1d:dfdf:ee5a:6399"
            },
            "active": true
        },
        {
            "id": 16,
            "name": "Franklin Resources Inc.",
            "address": "168 4th Street ",
            "city": "South El Monte",
            "state": "CA",
            "zip": "91733",
            "domains": [
                "carevi.us",
                "itcorp.com",
                "convergent.com",
                "utc.com"
            ],
            "ips": {
                "ipv4": "190.214.50.94",
                "ipv6": "ce94:95ce:679d:dfb5:fae:6889:2849:723"
            },
            "active": false
        },
        {
            "id": 17,
            "name": "Viad Corp",
            "address": "678 Cambridge Drive ",
            "city": "Simpsonville",
            "state": "SC",
            "zip": "29680",
            "domains": [
                "bosniantv.us",
                "grebyn.com",
                "sq.com",
                "ncr.com"
            ],
            "ips": {
                "ipv4": "42.237.241.154",
                "ipv6": "1b8d:2e05:18ea:ede:3a6a:b455:11ab:c6d"
            },
            "active": true
        },
        {
            "id": 18,
            "name": "American Eagle Outfitters, Inc.",
            "address": "973 Route 1 ",
            "city": "Munster",
            "state": "IN",
            "zip": "46321",
            "domains": [
                "northrop.com"
            ],
            "ips": {
                "ipv4": "196.60.233.172",
                "ipv6": "d32:5afa:6ad3:6d4b:180a:fda:74b7:fbb3"
            },
            "active": true
        },
        {
            "id": 19,
            "name": "Vishay Intertechnology Inc",
            "address": "127 Fairway Drive ",
            "city": "Victoria",
            "state": "TX",
            "zip": "77904",
            "domains": [
                "sex2u.us"
            ],
            "ips": {
                "ipv4": "179.247.67.188",
                "ipv6": "7af9:d55b:e07e:a96c:44bc:202d:a903:2802"
            },
            "active": false
        },
        {
            "id": 20,
            "name": "Toys 'R' Us Inc",
            "address": "826 Jefferson Avenue ",
            "city": "Elk Grove Village",
            "state": "IL",
            "zip": "60007",
            "domains": [
                "symbolics.com"
            ],
            "ips": {
                "ipv4": "83.223.218.122",
                "ipv6": "596d:d522:3d4a:d182:380:e6f6:716c:69ab"
            },
            "active": false
        },
        {
            "id": 21,
            "name": "Cablevision Systems Corp",
            "address": "137 Route 17 ",
            "city": "Mcdonough",
            "state": "GA",
            "zip": "30252",
            "domains": [
                "ftasex.biz",
                "teltone.com"
            ],
            "ips": {
                "ipv4": "65.39.157.151",
                "ipv6": "dbc6:7fc1:8c12:3227:a22e:ce75:5797:d74c"
            },
            "active": false
        },
        {
            "id": 22,
            "name": "AGCO Corporation",
            "address": "87 Laurel Drive ",
            "city": "Oak Lawn",
            "state": "IL",
            "zip": "60453",
            "domains": [
                "carevi.com",
                "bell-atl.com",
                "peregrine.com",
                "cisco.com"
            ],
            "ips": {
                "ipv4": "236.204.28.236",
                "ipv6": "9afc:e170:dd2f:cc89:8f80:1592:556c:a517"
            },
            "active": true
        },
        {
            "id": 23,
            "name": "Frontier Oil Corp",
            "address": "199 Route 17 ",
            "city": "Elk River",
            "state": "MN",
            "zip": "55330",
            "domains": [
                "goebid.com"
            ],
            "ips": {
                "ipv4": "189.176.239.176",
                "ipv6": "1544:4736:5038:b1fb:ac3:bbfe:416c:121a"
            },
            "active": true
        },
        {
            "id": 24,
            "name": "Quintiles Transnational",
            "address": "458 Country Club Road ",
            "city": "Pittsford",
            "state": "NY",
            "zip": "14534",
            "domains": [
                "sexbomba.us"
            ],
            "ips": {
                "ipv4": "255.197.53.65",
                "ipv6": "6742:c67c:3600:8ac1:97cc:ea1a:6691:a940"
            },
            "active": false
        },
        {
            "id": 25,
            "name": "Worthington Industries Inc",
            "address": "281 Mill Street ",
            "city": "West Chicago",
            "state": "IL",
            "zip": "60185",
            "domains": [
                "ibm.com"
            ],
            "ips": {
                "ipv4": "179.90.14.106",
                "ipv6": "8619:8ee7:6955:8d37:7891:173a:230b:635e"
            },
            "active": false
        },
        {
            "id": 26,
            "name": "Xcel Energy Inc",
            "address": "705 Center Street ",
            "city": "Coraopolis",
            "state": "PA",
            "zip": "15108",
            "domains": [
                "dfamconstruction.com",
                "ray.com",
                "spdcc.com"
            ],
            "ips": {
                "ipv4": "41.128.215.100",
                "ipv6": "e1a1:cb6:3aa3:d4de:84c0:b42:509c:1625"
            },
            "active": false
        },
        {
            "id": 27,
            "name": "Comdisco Inc.",
            "address": "308 Cedar Lane ",
            "city": "Clemmons",
            "state": "NC",
            "zip": "27012",
            "domains": [
                "gohi5.com"
            ],
            "ips": {
                "ipv4": "1.130.151.115",
                "ipv6": "de48:b438:d778:4877:7e3d:eeec:975b:e020"
            },
            "active": false
        },
        {
            "id": 28,
            "name": "Exide Technologies",
            "address": "135 Marshall Street ",
            "city": "Clarkston",
            "state": "MI",
            "zip": "48348",
            "domains": [
                "sri.com"
            ],
            "ips": {
                "ipv4": "74.55.184.37",
                "ipv6": "d029:1320:3fe6:d019:e47d:c096:997a:3d4f"
            },
            "active": false
        },
        {
            "id": 29,
            "name": "GATX Corporation",
            "address": "58 Summit Street ",
            "city": "Methuen",
            "state": "MA",
            "zip": "1844",
            "domains": [
                "sun.com"
            ],
            "ips": {
                "ipv4": "236.121.200.201",
                "ipv6": "c47d:c5b0:d968:77d4:337b:9bac:251b:8c6b"
            },
            "active": true
        },
        {
            "id": 30,
            "name": "Budget Group, Inc.",
            "address": "648 Hickory Lane ",
            "city": "Jackson Heights",
            "state": "NY",
            "zip": "11372",
            "domains": [
                "ti.com"
            ],
            "ips": {
                "ipv4": "4.104.59.206",
                "ipv6": "f1ad:a5f9:6291:d250:fad4:f4d1:f703:936a"
            },
            "active": false
        },
        {
            "id": 31,
            "name": "US Oncology Inc",
            "address": "139 Cross Street ",
            "city": "Pensacola",
            "state": "FL",
            "zip": "32503",
            "domains": [
                "adrianam.com",
                "tek.com",
                "data-io.com",
                "prime.com",
                "ide.com",
                "quick.com"
            ],
            "ips": {
                "ipv4": "46.59.11.1",
                "ipv6": "6c12:1edd:83b8:8663:7e27:b35:4a97:2d27"
            },
            "active": true
        },
        {
            "id": 32,
            "name": "CSX Corp.",
            "address": "105 Academy Street ",
            "city": "Raeford",
            "state": "NC",
            "zip": "28376",
            "domains": [
                "coolsat.us",
                "pyramid.com",
                "ccur.com"
            ],
            "ips": {
                "ipv4": "237.65.248.171",
                "ipv6": "ac40:511e:daee:5e3e:786c:e2da:5544:f228"
            },
            "active": true
        },
        {
            "id": 33,
            "name": "Reader's Digest Association Inc.",
            "address": "932 Canterbury Court ",
            "city": "Chicago Heights",
            "state": "IL",
            "zip": "60411",
            "domains": [
                "think.com"
            ],
            "ips": {
                "ipv4": "232.40.197.247",
                "ipv6": "e616:7271:b1a2:56ed:a25f:cc73:f95a:30b0"
            },
            "active": false
        },
        {
            "id": 34,
            "name": "Phillips Van Heusen Corp.",
            "address": "160 Redwood Drive ",
            "city": "Pickerington",
            "state": "OH",
            "zip": "43147",
            "domains": [
                "brendonm.com",
                "ge.com",
                "quad.com",
                "rdl.com"
            ],
            "ips": {
                "ipv4": "186.162.76.69",
                "ipv6": "7a91:5321:bfdd:1a1b:753d:56ff:9672:a4b5"
            },
            "active": true
        },
        {
            "id": 35,
            "name": "Maxim Integrated Products Inc.",
            "address": "922 Grove Street ",
            "city": "Oak Forest",
            "state": "IL",
            "zip": "60452",
            "domains": [
                "e-bidusa.com",
                "nec.com",
                "cts.com"
            ],
            "ips": {
                "ipv4": "192.217.157.227",
                "ipv6": "c42d:d275:c4bf:eaa1:4eac:fcc8:be0c:2bf"
            },
            "active": true
        },
        {
            "id": 36,
            "name": "MPS Group Inc.",
            "address": "472 Bank Street ",
            "city": "Stone Mountain",
            "state": "GA",
            "zip": "30083",
            "domains": [
                "ftasex.com",
                "portal.com"
            ],
            "ips": {
                "ipv4": "159.207.193.131",
                "ipv6": "4470:79db:64ed:c9c9:7b5e:fb75:825d:90e5"
            },
            "active": false
        },
        {
            "id": 37,
            "name": "R.R. Donnelley & Sons Company",
            "address": "940 Mulberry Street ",
            "city": "Cheshire",
            "state": "CT",
            "zip": "6410",
            "domains": [
                "edinm.com",
                "inmet.com"
            ],
            "ips": {
                "ipv4": "92.78.73.190",
                "ipv6": "d172:2e4f:a883:90e9:5a38:91c1:b154:1839"
            },
            "active": false
        },
        {
            "id": 38,
            "name": "Fortune Brands Inc.",
            "address": "47 1st Avenue ",
            "city": "Wisconsin Rapids",
            "state": "WI",
            "zip": "54494",
            "domains": [
                "ftasex.net"
            ],
            "ips": {
                "ipv4": "16.151.52.183",
                "ipv6": "d055:d908:40ff:9fe2:e65e:7bd5:fdb:24ef"
            },
            "active": true
        },
        {
            "id": 39,
            "name": "Yellow Corporation",
            "address": "485 Wood Street ",
            "city": "Cuyahoga Falls",
            "state": "OH",
            "zip": "44221",
            "domains": [
                "ba-sat.com",
                "stargate.com",
                "unisys.com",
                "tic.com",
                "dupont.com"
            ],
            "ips": {
                "ipv4": "245.147.252.71",
                "ipv6": "2d68:52:d6db:6618:f107:597d:9435:e5b3"
            },
            "active": true
        },
        {
            "id": 40,
            "name": "D.R. Horton Inc.",
            "address": "194 Route 41 ",
            "city": "Chardon",
            "state": "OH",
            "zip": "44024",
            "domains": [
                "hp.com"
            ],
            "ips": {
                "ipv4": "163.142.177.236",
                "ipv6": "a529:7d77:36f7:8afd:20d2:c89:e558:c345"
            },
            "active": true
        },
        {
            "id": 41,
            "name": "Group 1 Automotive Inc.",
            "address": "604 Sherwood Drive ",
            "city": "Apopka",
            "state": "FL",
            "zip": "32703",
            "domains": [
                "evestate.com",
                "alcoa.com"
            ],
            "ips": {
                "ipv4": "13.210.120.170",
                "ipv6": "c86e:e5e7:c1c8:513:ba51:b025:840c:ae3f"
            },
            "active": true
        },
        {
            "id": 42,
            "name": "Illinois Tool Works Inc.",
            "address": "742 3rd Street ",
            "city": "Sarasota",
            "state": "FL",
            "zip": "34231",
            "domains": [
                "carice.us",
                "siemens.com",
                "ci.com"
            ],
            "ips": {
                "ipv4": "95.176.235.170",
                "ipv6": "7936:4a7:4a7a:fafa:da46:e529:ae61:a8fd"
            },
            "active": true
        },
        {
            "id": 43,
            "name": "Sealed Air Corp",
            "address": "401 Dogwood Drive ",
            "city": "New Baltimore",
            "state": "MI",
            "zip": "48047",
            "domains": [
                "carevi.net",
                "boeing.com",
                "dg.com",
                "slb.com"
            ],
            "ips": {
                "ipv4": "2.172.34.189",
                "ipv6": "988a:b6c5:29d0:bceb:2a87:b2e:353b:f14"
            },
            "active": false
        },
        {
            "id": 44,
            "name": "Sequa Corp",
            "address": "946 Aspen Drive ",
            "city": "Canandaigua",
            "state": "NY",
            "zip": "14424",
            "domains": [
                "bosnaplanet.com",
                "isc.com",
                "tandy.com",
                "datacube.com"
            ],
            "ips": {
                "ipv4": "154.188.194.39",
                "ipv6": "ae17:8709:d217:79ad:7305:d309:684f:1bed"
            },
            "active": true
        },
        {
            "id": 45,
            "name": "Rock-Tenn Co",
            "address": "947 Heather Lane ",
            "city": "Monroeville",
            "state": "PA",
            "zip": "15146",
            "domains": [
                "ba-sat.net",
                "fmc.com",
                "adobe.com",
                "vine.com",
                "lockheed.com"
            ],
            "ips": {
                "ipv4": "154.17.233.6",
                "ipv6": "2722:9cde:4ccb:e512:e172:d7e6:62ef:4af7"
            },
            "active": true
        },
        {
            "id": 46,
            "name": "StanCorp Financial Group Inc",
            "address": "276 Warren Street ",
            "city": "Fairborn",
            "state": "OH",
            "zip": "45324",
            "domains": [
                "crnka.com",
                "vortex.com",
                "amdahl.com"
            ],
            "ips": {
                "ipv4": "160.164.126.29",
                "ipv6": "46d4:4e8f:77c3:dcd4:8319:e600:61ac:9b96"
            },
            "active": true
        },
        {
            "id": 47,
            "name": "McCormick & Company Incorporated",
            "address": "829 Cedar Avenue ",
            "city": "Georgetown",
            "state": "SC",
            "zip": "29440",
            "domains": [
                "bellcore.com"
            ],
            "ips": {
                "ipv4": "80.9.89.38",
                "ipv6": "3d8b:d471:4966:f12b:8a93:ae51:75f0:32a3"
            },
            "active": false
        },
        {
            "id": 48,
            "name": "Flowserv Corp",
            "address": "572 Tanglewood Drive ",
            "city": "Uniontown",
            "state": "PA",
            "zip": "15401",
            "domains": [
                "dec.com"
            ],
            "ips": {
                "ipv4": "242.123.228.150",
                "ipv6": "fa8d:d3f5:d2:5fc5:6cbd:e0d6:7cc0:b065"
            },
            "active": false
        },
        {
            "id": 49,
            "name": "Harley-Davidson Inc.",
            "address": "946 Main Street North ",
            "city": "Wallingford",
            "state": "CT",
            "zip": "6492",
            "domains": [
                "e-bidusa.us",
                "kesmai.com"
            ],
            "ips": {
                "ipv4": "149.54.182.44",
                "ipv6": "f5dd:e2fb:f511:cee6:d9e4:98b4:b300:3d75"
            },
            "active": false
        },
        {
            "id": 50,
            "name": "K-Mart Corp.",
            "address": "317 Elm Street ",
            "city": "Wheaton",
            "state": "IL",
            "zip": "60187",
            "domains": [
                "e-bidusa.net",
                "mentor.com",
                "cgi.com"
            ],
            "ips": {
                "ipv4": "228.151.219.91",
                "ipv6": "41b5:6198:4ac6:47fa:b29d:201c:c3e4:6656"
            },
            "active": true
        }
    ];
}(this);
