// Variables


// Determines Table Titles to be displayed
// Used for storing information in Beer objects
// could this pull from board custom fields
const menuHeader = {
    tap: "Tap",
    beer: "Beer",
    serving: "Serving",
    price: "Price",
    growler: "Growler",
    origin: "Origin",
    abv: "%ABV",
}


//////////////////////////   Pricing  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// Determines markup when calculating price based on cost: priceOz = costOz / markUp
// priceOz = costOz / markUp
const markUp = {
    "660": .3,
    "980": .3,
    "1690": .3,
    "1984": .3
}

// Determines how much to add at the end (as a base amount): price = priceOz * servingOz + plusValue
// Price = priceOz * Oz + plusValue
const plusValue = {
    "Nitro" : 1,  // Could add more options to "Special" customField in Trello
    660 : .75,  // 1/6 BBL
    980 : .75,  // 1/4 BBL
    1690 : .75, // 50L
    1984 : .75  // 1/2 BBL
}
// Rounding: Calculate prices to the quarter of a dollar [1 => 1.0, 2 => .50, 4 => .25, 10 => .1, etc.]
const roundValue = 4;
// Minimum price for something with alcohol on draft is $5
const minPrice = 5;

// How to calculate growler price
const growlerCalc = {
  "pintToGrowler" : 2.75,   // Based on price for a pint
  "ozToGrowler" : 44        // Based on cost/oz (if standard size is not 16oz)
} 



///////// Trello Constants  \\\\\\\\\\\\\\
const key = "a211f4aca7fb3e521d652730dd231cb6"; // unknown who this belongs to..chuckskegs@gmail.com?
const token = "ae6ebe60b45abcd2d4aa945c9ab4c4571bd6b6f7856b1df0cd387fbffc649579";

// Defines functionality
interface Shop {
    name: string
    ids: string[]
    testIds: string[]
    locationId: string
    categoryId: string
    categoryIdCurrent: string
    taxId: string
    list: string
    list2: string
    listSame: string
    board: string
    headerColor: string
    version: number
}
// Location Specific Information
const GW: Shop = {
    name: "GW",
    // Square Item Ids: 75 total
    ids: [
        'RGC6B33N7OLDHZPSFVLS7Z33',
        'VK2YGSFYCYXI6SORE6PSR76O',
        'TLZMWBP6BEUGHXQLLP4TRXBP',
        'DQ5NB3CI2O4NE33D3SR4AHBF',
        'H2AZGF6EW6YNX4KLNXIMWAEI',
        'KEWDKHRNOU3UJ7MZMKLKKM2B',
        'DV3UUMRDMFNSAAND75KT2E47',
        'RYGSC6HT3WMJHA3IK3ZWIRPL',
        'FJ2H6PDV4XZHQKCOEGOOZXEK',
        "EIXTXSAIWL7M2EHIFZ7KIVZ2",
        'GLAODSFTIHKTX57N7CVKZYMO',
        '4W3K2S2IE6L24BPRT4DFBJIP',
        'P4MFYST5XW7SYORMGYSZORMD',
        'NAUSGK6RNGMEVJCU5KPYXMKZ',
        'O7WHYKABKLKVSCELMDTZA6PI',
        'RQDG3STCBU3MOBVOXFBM5H4M',
        'GPFT2OXMJ2W4E7ZEIC26Y5PF',
        'MXQ2SIN2D7WJ6WRBPYAAHXT6',
        '2MHFIWJHNALA4TSUSS64UNU2',
        'KDEGKYGKRFBDMHF6UCC3XOUH',
        'GXYK5Q5EXT7U2G7JDYXNZLIU',
        'LUARKZ4W7M7P22KAJ2P6S2NW',
        'RX7LJ4HQCQHYXFB3TDEZGM2L',
        'RKCLIABEBIMRWQDTJD337L7I',
        'QSNJRICP4O324LQ66SDVQNNN',
        "M5Z5WBDGIRAVN3J5D6UVRF7I",
        '2WAJWWGE3ZD5QAJPDKZ4NDHX',
        'RIEF25JP6FTCNNCGE65WJGLT',
        'MVKUD2LNKO7URAL374PMXNBI',
        'AKZAX53KHP2XTOHLIHSG2I4L',
        'S5Q5CIXEFPAQONI2FJNDID4R',
        'OBVLQMHEKYUODRLCM2WTPJRA',
        'YTCTPYACXDKQUGJXX77LFJAU',
        'QWGDAUASQOPW7LKHRLX6DIF6',
        '74KS63SXEZQEMHSWNDFYZWXT',
        'TFLXSABAD23I3EB4EKI2TCZB',
        'ZHNDMBXHMJ4CCMU547KF2EJX',
        'Z3D3P4ANO6SEHQYYXVMLWZCX',
        'TYJ5XKWZL4ZYCVGOKODYD657',
        'C3RAADV7TCW7M54R35UXCLNL',
        '32QN5TWYJFPAE3JAKKHJG7S5',
        'MX3S2OPSN7ZCRXBELQKW2XLV',
        'LQJA6QGKV3FUEOEHCW4YUIOF',
        'VG5BWFNRHJNQM42JUQ6WYR4B',
        'XTOWX6PJMZB3YSSZHEFAKE5A',
        "J44ZQYKVATDPCELE4TGI5VGD",
        'MGSB2BQGQJKYEUJX2BU2HBRX',
        'BXSALJY7UCEJS3PTCIVQB3YV',
        'VPHZ3AHQUDWGY43LZZO2FWON',
        'YLZ3ASXCYAEVMR46MDTSTST6',
        '2K73T5CP7QI3YQRAMUKPXCCE',
        'HUFI6KBSCEMDYWTMCN6DPSCA',
        '74AVNS7Z7LGBDLUMU4OUYRBO',
        'ILWFWNIFJ7754EPQGORC47US',
        'VZT5KFMZBRKF4YRQUCSQAKF2',
        'F2BHVMOC4HU4EZEX6E7OP2UQ',
        '6ZMF5OJCYA4BLHNUFJELTCNR',
        'OIGYHT5WRFBBSVDY3OFJASM6',
        'F7ADBHH64WGFYMLOXFNZONJC',
        'M6DZCJSYY2FUF5VF5ANZIMSS',
        'YMXTEZIQNKSN3XJ7WF7J5H5N',
        'QFJ4JVTOCRRUL6L5ABA7YMLP',
        'SL2D7RZDAF7QDR73COSD74AC',
        'IZTSQL4I76KLUMTU3P3RRERO',
        'CYHULOVG42FHG5IDMG6YGB27',
        'Q5H2SRBJW6F5WZ32TIN2AZXR',
        'Y6YLAHNC2GLKTLX62YSPEAX4',
        'GSH4PAQHU7NIRQI2I7Z5SYSD',
        'HQUDA7CS3XXWJFWQU5YBH6R6',
        'PQUXB5D6XNUZQGAUTZ3HVNIW',
        'BYRWWSGUKU3AHYKAZHZ6D2ZF',
        'RVAGAJFSVZ3MIMRUJZZLORYO',
        'GPDIGWCEVE6TWM7I3247VVKI',
        'LGKJDRFTQWQSEDRFWOLZ7BL3',
        'ZIXL5AZSBT5ZXIGINCE32BSL',
        '5TZMIISJAYKVT3ELZVIF7WWU',
        '3FIOUYYS7WHBTHCOSVYR3M6R'
        ], 
    //["IITFQUSGJIEHTB2E6IGLKF53", "QTZGYYRXTLEGZF3Y6T6KZSXW", "J3N52PBXXNGNPYF7GEP3FT54", "IEHB5LIG6LLRI3NTOD3ICTAV", "FK5QYQEYF2IOFWTVGTZUK424", "KLINBA6WNNKDJK2RK45BPWH6", "PF2LBJC6EDRQLKVXXZBCSKVP", "H5FIVIPGO5BG6QPY3BTLUZD2", "MGUXUJYLZXJLMGWW7XE2FXKT", "NRKPMB3JURTVTWVVQUKKSKKK", "5P656ZFLMFL7QHESJGOXQN3X", "TMJ2GZGVWSSL3FDP22M3DOYE", "LR2OZ2SIOQSNPYPRF2GZXV2L", "VLK6DBMMP5B56ANXNZ2ZEDMT", "Q5SCHJ3GPWNTVTSRJ4IP4QGT", "BJ75IODUGRNF4H3EATUGMI62", "CIUFQIZJEGEA6Z6VXUIBVU7Y", "6CJKRPOPUC22OKCXPR5HM27J", "352PRFWTEG5R2UUUISY5V5EV", "NVQ4CTYW6EBP7EUGLS3PNUVQ", "PRXLI7RZHKN7WT2LE5BN5CMQ", "AYS6ZFZSVR4L4YR7FOKDLAOP", "W3G3OGENIMTT4K7E5JE5WKUX", "GVBVYEZQS5H23NZOHBD2RZKX", "EOMYADM2ZJZVJ2ENBMGWKHX6", "LR27SWZNQWYRP2UAVD4JEPDZ", "7IOKBYMVUDDWJLZVAOFXSN65", "7TPRLEJA2X2D44LOTSWVRDBN", "EZP55IH7LUOGX4DIG4CKSIKG", "EWEEA57MGLWTC4HYV6AOC3FK", "BTN5UKTXY2ZZFUXXHJMFPKZT", "M5ICCWORS5PA556WKXBOPORT", "BRPJOHF24DZSOXGKXFQPKBZ4", "CTUS7VY4BSDPB3U5PQZYYFGP", "F6PPPL4TY5JBP6MLCCF4ULV7", "VF6AF6IYEQS36R4FFMKPLFMH", "XEMAG5E3N5ERO3USLYJB5FLM", "FRCOSXI2FTYAVDHX5C2IJY6P", "TX6WK4ANPDQN4B2IPLTC4IPT", "3R2RALOPBFNTY6DHXDHG2YDI", "GXRKOB5ARPE4TIMTRGSATOVA", "XAFSN6UZWZDIAYPE6A3OCRHC", "6OK3AZ66TQOONHEPHBXPXETK", "PCMJA62GL3A3JOPNRQWQ6EUG", "C32UH56DAIESAXR2UK62S5S4", "2SGQB5WHCKH2VRHWGOOIBMP7", "4B5PTT6HHENKECVWOE444IH2", "PIF5KRZUJGKFUNRBWSY3GP2N", "RXSL3BEBNJCJ37XZKTPCCYNG", "4IYBUIDZ5AYUBMHA5US253C6",/*bottle start*/"FPHT2BJQPV2XWIXZYIE6IMHS","F6EGDGEEXEJLVP3DDYJDQHSU","BWJQWAE6LBY2WSPALWLDVJB3","OD2B22WIUGDEFW37GIRVXV57","DBLES5YIMWCPTKQFPV6FJEWJ","N7EUTKW3RQAJDC47QFCX4OOD","YSVDQBB7WMI2ESFLJCI2M4XW","YVFFAUHRR4T4UZEBWRXW5NE3","MYQLSVY5NVFRFCE5NMBIDRT5","TC5PT7NKMB3QRLGGCH72WUHG","3QGQ4Y72HAV5MDK6C4U3A32W","J3R2C4Q7EVTD5HUHACPRBP64"],
    testIds: [
            'R6FNVCJSON533H4B4R26JEOS',
            'YMTMLJDSS4XXXDLNL6LE522P',
            'DT4AWEWHAX444ZXIZGAGWNOU',
            'LYFMNT5IJPK4YE5IHRH4WYUS',
            'PWTFEBU5XATWU2VQNC4EMKCU',
            'PLEYTJHJMIQB6FPTYBBHYPI4',
            'QYLSQ3IVP7LIP5PC4IKCQVKW',
            'GD3NVL5XONMTLJMX5JPWMFDR',
            'AVHBQR62UQ3NYMUHWIAM7UCL',
            'JIEJGYLZSNDHT2ZB7KLNBXBI',
            'BBQYP6NSH7NUBORWIAHSPGWD',
            'E42D6Q67KKNR5UV66ZVDOFDS',
            '4ZV536S67XG4MWY3RFKS2FRA',
            'MUIVSOVSMBUJB6BMJXON27AK',
            'ZNKL6YWUZTJSE5S5GCLI62FK',
            '5HPYAW2S27NVVNL6CAWP3VE3',
            'IBSFD4GVGQMNK4KHTEZEZCVU',
            '5TKZF6UUULT5YSZZT46YCXF6',
            'ZK3KP2RKDUVBNIRSJ5GJS6K4',
            'O2BBY7YKS57N2TKOZ2KKJBZS',
            'L2GD7MFIHOKVANHTAOSBBCTT',
            'SNELFWVST2N2LKW66G4EYA3D',
            'BECLMKWMNR6VHDIVRLXDCB5F',
            'I2ADHRLPADCOZH7FZZTN33FL',
            'VRBFGSC7MTS6DM654NN6ZSAR',
            '2W7KVNNAUIYWTUIGNPS4J5S2',
            '7HSFRZ47DNMQHL75G2AUOQYU',
            'AZQ2Z4LQJJ4CL5IWEFTOVFOI',
            'PRRSW2SK5T4IJAXFG77ZX4CF',
            'NBXKWVXQZ363TET3HQBBIXVD',
            'QBPF56GBMT5SFOIS5W7KY55S',
            '4JEPMIIXQCD7465HVM6NTWWD',
            'CLQTD5BH2D6DJ6JAFVGOQM6V',
            'O22RKJYHRLK5LFJQ3MRECHRX',
            'EPT3SQXVTTZSOZLJ3OLVGBXU',
            'SYEX2XJXBM5T7KNQAKESOEFS',
            'AEUJQE75DJBSBHMDP7GITWV5',
            '2GXGSZZ3535WR5D65XFM6UQD',
            'D4ROYKYW7P6VARDFCYVVHQER',
            '2X6VTWD4JGUPBKVVTLRGCLAX',
            'T6KQ4WSIMACGTI6MDSRSNWUC',
            '2TLWA3RTWHO3M3ORMXQMWMJQ',
            '5Y47RMDNGINLRXEN5OAMMKJV',
            'OOKWZTIMZAKFKKJTI3GF3VEB',
            'T3XQG3PQ4DENL4I6DF3XANFI',
            'YSFZ2QIZ7VZQ2IKYWO67VKAH',
            'K5B6YPFYBJMBVNIBCW7JEX22',
            'ZVD4LD5UWAL2R2TS4AVRI3IN',
            '6FI747WE3CI54XPH2DTGESFK',
            'BMIQDV4AYZPMEPCPQGS5Z6ZW',
            'RRH3MNMFQG7YTW22TOS4F2WL',
            '6DC4PY5ZZIRTTEWBKZUF2ILI',
            'FACJ2ZM4C4X6TFSZIMGT53CZ',
            '6K5XH7PBBW26KUOERJBRB77W',
            '66TVVIBKWJAJRJWDL6G2WEFI',
            'AX77WK6C4JB6SOFPNTSDFPQ6',
            'S3FJ3QHJ63W7TDLWRZXGRMEV',
            'F72M7Q2FMM3NOUPX6EK3XKK5',
            'PAUEFK55VUSE6R37HSAGG6DC',
            'KROW6OJDM4WC5GI5VRWC2HQG',
            'SSY2JRP5GOQUXPA6U3FBEPSP',
            'Y7Y362Z2VMIPPS6W7CJOPT3W',
            'KU422AB6VOFZ74VUML4TZPBM',
            'G4OD2XMA4NWA4GKJWWD647SY',
            '5C7MPOQXLZXVYLOFEFTIJU4P',
            'N4F5MWZ4ML2JALPNZVDERCXU',
            'L2TC34JM6M7OW4TB73QUFBCG',
            '3XSO2PRTZ4IV65JIYLCWRF62',
            'ZTH2J3YYWLE7T6CTHGPOB4VE',
          ], //first 25. okay to be over
    locationId : '18G28H1KRZ4DZ',            // GW Square Location id
    // oldlocationId : '9ESY9PNCR27FK',            // GW Square Location id
    categoryIdCurrent : 'LBVNKAIGKBBTVYUUPLQYYPSC', // GW Draft category
    categoryId : 'BABVBDNBR3BN7AU6B5RAZIUA', //'IAMND6RIAHITPBCWZKXAPJVU',
    taxId : 'RXOC4GJO6NV4EGCZNZY5G64Z',
    list : '54ab33ba0fd047932d812777',       // GW Trello Keg List
    list2 : '5e4cbbd5530d1a7c55de65a1',      // GW Bottle List
    listSame : '5e1f9e54f5719012a69fba14',   // GW Same-Day Trello List
    board : '54ab339ee8e7ddb91a778d68',      // GW Trello Board
    headerColor: '#11a618', //need to change within view.ts
    version : 123,                       // Version of Square item to be overwritten when being used
}

const CD: Shop = {
    name: "CD",
    // Square Item Ids: 75 total
    ids: [
        'SA4M7LP3KG4B5VMRYQAX6UTP',
        'RMKEOCQG7BOO5C3Z3CCW2GAY',
        'ISKWXUCU6JQP3AHYGRB5ETWY',
        'JXANSOERCPZ52SZ55FI3UFOL',
        'RXMAXQIB2FAQQIGG5DD3ON5C',
        'WRVYYZ46RXORETPCXYXV7LQH',
        'QEFWJNUBBB64OVGTRAH3PZJO',
        'V25QTX5PJMNSJDZ5SU5WJJYN',
        "I5TJGH6I3QIEHOIBCHGTB6CO",
        'LE7SKFGIBZH67TGQMKWCQTHY',
        'V7TZBWVBL3KNXFWE2IRDKLHP',
        'QVNXBSIEJW4DZ6IKNBRERNEF',
        'OVBJ2OZG6E5BWW7CS2M7XXGJ',
        'GUZHNGIZJJURBL7TYDJQH3TG',
        'C4UX4XWQRJEFOOO2JZYEUOER',
        'FTNS3CJEQAOI2ZHTFCHG6KAC',
        'FKHITPGOEV7PQJZASEBDEMCQ',
        '2WUDFB3LA5YDENS536C7UC4G',
        'DBHX7L3DQW7JU7YRF77AXW2I',
        'KC4PY3DIV2JQTRJ7Z4DTRPSQ',
        '6JDNCZLFW5LPIJCZHOKHNJRO',
        '26KCOKC56YHB7U5RBLALEW5X',
        'ZC33FKUGP2AYO6CS3FIA3MCU',
        'LH4EODXAKOTL6X2V2BOTB4IM',
        'XRB54SBNV4IXGACODFXOXJQV',
        'GLGRCUTQWQHWF44OICEQOABD',
        'HJBKAFVW6476PKUFKSCFEMPR',
        '7HV2UG5GMYP5ICLLBGDZYIJZ',
        'LI53BVJS3AEUZED6O67PDNOL',
        'POGUM6EDGFPFTA7CQRULHD4K',
        'QOFTWDCB43QKU6XC6CNZHBDG',
        '5A3VSC26AQAOVJ52BCSQ3WQV',
        'B3YJAX7GKPIHEONV7J3XYRFD',
        'YQ6PLBBYB6T37GW4TP7MIRMN',
        "AFNO67RY26QA6I3B6WQXVHJ2",
        'P3DXYGNKQP42E35NAYZN4F4B',
        'ZTH53MQABTBVQBGCOU6FG2S7',
        'PITBB3YRGNQYCAFWW6TDYROZ',
        'GFF4IPX6MRWTWZUSMUOUUOZL',
        'ABRL6CYOCVNITOVVMWE46T67',
        '4TSJ567KHHZHQJ2ODLLN2GFL',
        'BW6B3F5VWSS5PXDFAXGN4XHN',
        'VMZ6LZ62QBEKXYMUJGXPSCPB',
        'LGHTMRCXMA5INBGOXHPLEBES',
        'UMNBCT6NTITSCNCPAVEAIWIF',
        'WIP76WBHZOSITZXDRKGEADCJ',
        'BDXRASXQVUUYGLVFVWW3CVZA',
        'ART4YBM7UXZ5IMI5GHH3WMXP',
        'YGRVMTRSJXBIZA4OSVDQXUII',
        'TUNDD46BCX6LZJJ67AJSF2RK',
        'DDGY5AXLGTXOU2W3JJPVWUPN',
        'JCMIG7MZH35HPZGD54IA64DI',
        "X6MWKD5IZJ7SV2HJHHFRFXZ7",
        "LRDJBASJXOOIKQFCBDYFHGJI",
        '73XUUW4MYMPTZ34OF3U6NU65',
        "A5CABWAIKJNENRBHBAUZWK4E",
        'OYD2QUWZYHWJ5DG2QWRCOFPB',
        'KKOVJQ2QOCRGF3RNUQND3SBU',
        'VAAWWQTOMWN26TGJD2XTJECM',
        '6QAPOWHV4PBFSOY3KAQBGJTN',
        'PLWP5ECXZDZYWTPPK4CNCQBJ',
        'M5VZ5K6ZM5PCJ5C3NGRJEKNC',
        'DSZTLZ3XIKDK7Q7XWJT6C43M',
        'MEHJIZQSDIIGJ7K4TIEMIMA3',
        "36WENUUFOANLJ5BTIPH44PWI",
        'MVIPVLBPJMQ3V7BUJYQYQKIS',
        'ZMRICSWGUYH42BMXZGUQIDI6',
        'GMT6AOY2GJBM5AZ33DA3ZH6Z',
        'IQBKNPBQS2HDS6V6PN7UORNQ',
        'E2CX2EC7HUH6T73F7GOW2U5N',
        '4DWVFV7UWMUCAJHOHDZ5NJMX',
        'FQXN2FHN3KJ2JOFRRIJPU5CM',
        '6LMSKJ47EJVWCDPWPIWDIV66',
        'JYBCIU5JLIFVGZPOJA4HNVLT',
        'A3EG7HYEDJF426DQ56XR4JR2'
        ], //["523O3VV4E63B3ZWEDKCYZIUO", "YCE5PAU5UU3CYJHEBW2UPL6E", "27LPZYFKLZCDNIKL3ECELMQH", "JBZDVZ7LR6Z5C47PNTOIVGXZ", "TAKDCWF6M54YY2S3SGB4BP2V", "ONXJMSCMVQ766I6VMPLLHJ53", "O5HJDKLWR6Q3VJD5SHWD7IEP", "43WD4HEEKGGJIFRRINP36CRN", "B6TC2L6B7SHXSXG5LSJFOPPD", "5WPXQARF4O7XDCC6WAJXMDLQ", "PQJ5SQD7ETPYDDA3HCHL7DL2", "MXCFDM5FRUEXHGDQDQN6OBF6", "K6M2ZI7YVTA3IZLXLXCHRL4R", "6CH255HOECKZYTBUYCHMOWO5", "EO6VXD6Y7ZCCUDOARIGFA475", "YHHKKZAD56VWCBCKHKEQIBMT", "IT7EVK2N2ECHYXVN7NFFZ47I", "ADITFVLCRJWEFESY2N3UKCDG", "BNHG7JVYYYIMH7Q4OPB7Z3IT", "UX47HF2NUEZK25RZXI266PHY", "G3N6ATCHHDRP2ZFF7X673VLC", "GGAXK2X6E7QNR6EPLON7KLKC", "HM2BODX55QURHW4KIAHY4HME", "SJXHO4MR2XLGVOBI7V6RS4G5", "ZYA2SUR5P74UJI2XAUEIQRKF", "WUVOEQVWXNGEEXMYEBWFILFJ", "VUXZYS3CJ4TRCIYS3O2WG4K7", "UGG4ELC7PNQOG6CWR2E26OKT", "UUMNSLUJJP2B5U4XU6NEXWLT", "UXBDIV7JFVORE7M37DYCVCKC", "S6UMNQ6TI54NNCV5DCSZ3LM4", "DM6G5HD37O3QH2FLEYMTQKVY", "W3BEO6RI3WV46THSTY5TPS6P", "RPLVZYSR6N5VI5MMEG2C7O64", "XTR23XX4OFGA6JJ63R7Z4CO4", "KNILES27WPMDZEZ5YWKV32WA", "GRGPVLKCZUD2TDWXULPOYOAV", "GP5K5B6LTCQNCTFBVWYIGKKL", "YXHWAP5HZDH43GZZ43IERFSF", "CM3HJD4ESO7SOY77OIWV5WJS", "JVMXHUB4DUOP6XSSH6F3DJUU", "5RUB4NBT46JWZW5LCWIIWE3C", "ZWQQBFYM5K34NC3VXF6JJP7H", "WKGN6VGD6DPDFD5KBJD4VZTG", "54CKZXB32QRQNWTWHT4TVYPC", "KNXBLNYT6SDKSFH7UKJEBOTG", "2NAYVLFE3SG6JOS44LI6JBSA", "MTZV7BYLEVNA6EAWPCMU72MI", "3AQSMOBLWSMKQTMGIGRSGELF", "NUWHYQSSDJEQD4NJOHQWM762", "AL5MTFLZCNEJOVDZ6VASMLVJ", "N4TXBN6FJK4KKWSX5LP67QTF", "IEOTCWP7BFG55AKOLDQ5GAXY", "QRVL4EQHHKHMOSGNQ5DJQBM6", "CHJ7O6PD7UAURRJCRR3LHFZI", "AVRRKIWYYTILA6GHUAXGZCYF", "2XU7GV4WKXIB35SZULXDBIF6", "5FI3NXVQ6UNX6WDZ5QJBOBMN", "2HYIUGFY7GEL7B63MXRP7GF7", "PKXZIANVAJISGMC3T72WNEVR", "42UR2AWIHAWPOHH4SB57CMXC", "R3754J4K2BQ7IA62MTXBXMHB",/*bottle start*/"QAGYDKO6LAQKLWFNOGMMWMHK","CSTPA53Z5R5X2KN5EBQ6WQFX","ZRDYYRMUP7GZYXISXA3N5UYN","EKUH67Q7Y5MZLXYDVXWKJXGE","YBK3BA2XFY5UWMVOBGNUTQRZ","VX43UJSSOU3NE6RBO2LCAVLB","QAPPTXXRVB2WG5LRML62HTBD","SBZGYIDIQULZIDZF2FIICDH3","LC6R2YRNOOQHHZ3P4QEN4K57","7VN6AJTDYVTO624EZ2MTQTAU","F56GFOHSAS4TZ25T45QXPB5S"],
    testIds: [
            'CFWMG6ZRV7DBGRERH7AANCSV',
            'QRCN34PFVGTYJLOVJONRQCSX',
            'LFOHHE75PM7BOSS6TL4FQMPW',
            'HQ5QOSIR2TSX5IRVXUHQQYBZ',
            'KAQQMGBLPFCHS72C6C7TM56Q',
            'QRBZZ7D3Q3QHDXX5CGNHPVTT',
            'VRKCFMHNVEMYWCG7YIUOLJ36',
            '3GZAKZUV52S3DJ7OWUR4S5UY',
            'NGO5FAH6YBWU2D45CV7VZTKW',
            'CEINYMWBFCYBVS3475JJVP2S',
            'GDYMI3FJ3CA3WQJLPI2RDM5H',
            'UWE4TDCJHCPQUEFVLYBOOFO3',
            'LF3DZEIH3HR4Y6XIR6EXM6YP',
            'UTSUY7JY6CINPQUGXXA2LYZM',
            'IJ7AJQDW2IZ55SYYWXSWDKZJ',
            '4ZQTORZ6KLYYK5XMYODJNDP3',
            'WT7MMDNWMQV3V7QNTZDWX3MJ',
            'ICYHQFZWBZSY65PMVLYAEHFT',
            '4P7IABTKV43KJ3JWLATHXTTW',
            'OM7YDFH5FBCFTXVRC5XA3ETA',
            'HLHAIHQ5BWCXKEOQ5RFZHB62',
            'ZNNJJYV7LIJYLWPZLUH7ZB6C',
            'NVLYMVJPCZJXQRGJSICBVB4I',
            'YETGPM4WGHZEGUDL4BOIX7F3',
            'A425GUBZNC5JEJ7LRAFYKYKK',
            'L3POSGNS5B2NX62MU5K7B64K',
            '2LVP43HBUVRZMRRJ2FLPIP6K',
            '6WIOB3JWNC2ZCUZVA27OWCMY',
            'U5YVEDV5BSHTWNNSWYQE62O5',
            'GFJFC7RS2VNMTOGOTUXFEXKW',
            'TL6M63ADPMXHEYSPB3BEAXJI',
            'CFVYG45FPMVVQNDDPB7M3XM6',
            'UTKGKRG34TX5TOZ5NTLMKSPB',
            '57JEAM3DVIX4O5VRFI4BHEXS',
            'DHZXP4UERD3IFHTHPM55VGBK',
            'ZHIHEC7PXJPDGJFG2X5MHSLM',
            'UTDFCZF6OEFD4XGKNMMI7KFN',
            '3762GL5JGBNOTUH6C3AHDXXW',
            'UA7IWLO6ZJQDZE2AY373DRCA',
            'OIJJQM2HEMM2LD2GZWPXWIIL',
            'M23MPRLCVD5V6O3INOVUJBY5',
            '3BSA6YJAMP2SX6TKKX32CD4X',
            'KOGYPRATIBQERPYRYQVRHMGN',
            '452KMC5QJ3EQDR5OOGATU6EY',
            'QTY4VJNQIKLE4DJEQS6EQLRF',
            '36G4NJ4ELQTO72ORHRJQYIGP',
            '4WQESCSQSQYLSCIN3NIQ3HMJ',
            'NT6SVF642R737W5GL2KVT6JU',
            'HHMNOKBMNX5KQPEQOJC7YIG6',
            'A2QAMUH74PDMAFD3VH2D5DRI',
            'ZVPNLZ5EYGJ466JV2QML4ATF',
            '6DX5NYXROJD7OK2GSFKY6QXC',
            'C65LQNLHHKKTOYQ247XW7SU4',
            'WMUNBTTDZIVSYFEREBYB3DVM',
            'DOUENP7UWZK2YZH7DM2XNH2V',
            'MPVLPKHI5PVH7RRMWZ2QUF6Z',
            'BBV63HLZDRUX3VL3BFF7XXFG',
            'QBRDBBNYBM63NZLNKGEVWJYY',
            'FZKX7PDMY2JP7DNEFGX324F2',
            '7JJSKHV6VWLKOGOUENE7VMXV',
            'JONH2M6L2KFES2ENQGRGCD2L',
            'L6WLVKKOQORADPPVAAOEKGF4',
            'FLEVJYCKF47CS6F4CFJ2AB5C',
            'T4ABJ3BZYERD7TJLD53MXJZJ',
            'P7KOA2E7UPZCBOABVGLBB2AC',
            'Z672BOIZY7N2TK2XSUFFJ64H',
            '55UHL5Q2U2XYU7T7SGD5C3UL',
            'BMM7QIT5WTLYPI47UHCAVX6A',
            'MH76775SUA7YPKPBZGWU7XLT',
            'NTNIOYVVHD2JQQKPA4TJXPZL',
            'TAUG3BRAZZPVGQJ7B26KA5JR',
            '6TTM2LMJFCGQE2UXR2I2ACKI',
            '5UUBNBUXAE7CY7APTE77WBVW',
            'IUTP3GEA4573KGBZNPQ4RNUF',
            'F56GFOHSAS4TZ25T45QXPB5S',
          ], //first 25. okay to be over
    locationId: '69AVKE54JAEYC',
    // oldlocationId : 'EX68G9X85NXSX',            // CD Square Location id
    categoryIdCurrent : 'SN2VHQBZJGUYI5VKAJPGQUGA', // "Draft CD" Square category
    categoryId : 'GZRQYZQYC6YCJ3GB24VVXDIL', //'EOSIPL32MO5MFRUSD4UQKNRM',
    taxId : 'RXOC4GJO6NV4EGCZNZY5G64Z',
    list : '5592b25a535fb4a14dea3bbf',       // CD Trello Kegs List
    list2 : '5816346a1b9cf1166c582c8d',      // CD Soft Drinks List
    listSame : '5e28a6497050ff6c005f68cf',   // CD Same Day Kegs
    board : '54ab2dc27a5de0dd1a9cd67b',      // CD Trello Board
    headerColor: '#1134a6',
    version : 123,                       // Version of Square item to be overwritten when being used
}


// Controls the color to show on the Square POS system 
// Do not change, POS only allows a few colors
const posColor = {
    "Pale, IPA" : "4ab200",     // light green
    "Cider" : "e5BF00",         // yellow
    "Non Beer" : "2952cc",      // blue
    "Sour" : "a82ee5",          // purple
    "Porter, Stout" : "593c00", // brown
    "Wine" : "b21212",          // red
    "Event" : "e5457a",         // pink
    "undefined" : "9da2a6"      // gray
}



//////////////////////////// Square \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const square = {
    clientId: "sq0csp--BiUCzcdJ8pxrYRDE4gy-AO9gM3z-mbnAD_VyJRQLY8",//"sq0idp-GNJz38YO42bc95-iOPHyLQ",
    accessToken: "EAAAEIpKkM9R-3mGBVBEQ-7p8lBL9_JMi_pSXXt3sg9wkdjq8XSe-t6IDNWmJtBU",//"EAAAEAc8bQK1bCNQkoHHHqSlwIAiy2gEB-g8EtRqX0EVkYOlITOo_2yeZLsdEgS1",
    sandboxToken: "EAAAEAXy7GnOyfpJgrgzoLY9PGaVgro8Qxnzl3AHj_pCV7oYIYCs_XXR18Hn9b8x",
    gwLocation: "18G28H1KRZ4DZ",
    cdLocation: "69AVKE54JAEYC",
    taxId: "NIACWMSZSFQJEAWQHXWTOQGX", // Same for both shops
    // appears to be using first id last?
    testIds: ["4MASAM7MFFKDEYUE6M6TJW3H","WITZ5EVPRMQER5XWEZEIJNLY","NSX2Y2ZLCNNM3YAKLLQ63FJW","X5FJOG3GDNMVCLR24BW62KEP","JZKADMRFOLVPFOV4TL7ZNL5F","LGA7GSGROVU3IG5MR476BWCM","XQPPVYNJJN73XAVBDUBPKWOK","4B73RHSTLW2C2Q47GB6SA7CU","KRVUBMXQ2XSXC3526FQJ7X7S","XMXKEVKKLTN67DK4C4S6W73S","T6URMYZLTEWEOBNEWZMLE2B3","E5MHIVASMG65HNGQDBXZ7MK3","5ESTK4BXGHKBPUXLWH6KUISK","WRPXJNWRLZ6AXRZYIAMFRU7E","KJUJSM3NKSUT66RGNVZGYM7X","M6HJ6JWBE42AENCOQFTXCVE7","UHW7HKXLOPAISSASCB4MFXWK","WQSUAI5CYI4B4R2OPQ52LZG6","XBDQUDHLBQ33QDEZM7LMFAI3","R2EULXCRFGLZWH7AOLXVRIJ6","4ICDMEUU3E4LGRRCDHY6NM3P","5TVQV63NRQKWVTLERJOIN76R","4BVUF2YCHU53U3TILILWT2NG","TT2IHQZQZI3KHKTBPOI3WTXB","7LCABEZBDXENBVACQASYJP3C","C5SZQ4VJNKLVVMJRUL5DHSPF","7DQ7LUQ7Z3F7IQLHOGCDEZJT","RRYXFAMUVAECMC6W3HC3Z6LR","SGVAVETDE5LXZ54B2CTHJF4J","5ED4XKRGRYJWZGG3URQK6NPT","CNQWQ4DE7VNLMLKP75ZCE72O","OHHK3EI6NYHJIGTBZHW6DVGF","X7KFCP6445N4A6NE33BXBIXW","MKSHYITCDSFGMO6CNZLNTXGF","SBMU3WM7GR5MTAK2IUB2ZGIK","YPUVEYL3LB5XPK352XQ6YQPU","B3PMFT6275W773KE6LK3TW66","C7SDFHRKPD4ZXLZSU2VTWJHB","DJJFQMBUBZJ43X5JLW64TCOM","VYOAPNEFBHZGHGZKOBGZCOWB","RDBGLI5JCCINUZW2INC4KWK5","JGVDL3552QCMKBSLTJRMYOYG","MBGWWRK4BYASRMJ6PATJWI37","ERTYZ7RWWVDXDEYRZ5OBJLA6","5FJ6FZBLLGLJ3RDCQ5Z7MNCZ","GRZ6TMV7DI5W266ADZ5HUTXG","RSGCFGVSMP5745EETRXFNMOT","DJSASGB6LCQS4Z64ME77X2X2","YUM5LJWHWDUUGOPQQE3AIJNV","SGLYZOM4WZWU6MHJPASG6JCS", "P22DT7KS5O2YK2HR2VOKPHXX","WAQYB22NPCVUABNH62DLEN2T","CXLYUVMPUBHAGQPIJ25MWZUT","P6PDD7RZD6EHVYUWZA4RS4VM","JUOCOS2N3CJLI3D3R4O3N5GS","ECV5EEEFNZAPMBWABLFSRCZI","UG6V435CI4TDOPQ7RNSBGOLD","CTCKRKVH434GIXY3AKVD7KIV","QIZ6LKUUYAX5VGRZAJFEPKF3","GGXBO2RYA3EOEPMVW7UUC4DR","SDHA6SY6OJ42RL6WREN4OQG5","XCKVAMR6VYM4YATHELIUWQVY","PMFQJMWDE3DN5UN5TBXTYSSL","YXOJWTLOZDFRVRAMQFVG2AW3","DPQDDXET5LMDMO6WCEFA2FRF","KS4R5B33YFVGEYAYZYHYNMKS","L6RYPG2Z7VIN6XWAKM7ETXD3","YHDGSQCTD2DYQKX5UERC327N","PP6GYXUE4D67I2FCHENLEGJT","JYHCCHMVV65L4PV5WX5D5CJM","7T5WTQURXIIEEPCPFMYNRDTD"], //first 25. okay to be over
    testId2: ["P22DT7KS5O2YK2HR2VOKPHXX","WAQYB22NPCVUABNH62DLEN2T","CXLYUVMPUBHAGQPIJ25MWZUT","P6PDD7RZD6EHVYUWZA4RS4VM","JUOCOS2N3CJLI3D3R4O3N5GS","ECV5EEEFNZAPMBWABLFSRCZI","UG6V435CI4TDOPQ7RNSBGOLD","CTCKRKVH434GIXY3AKVD7KIV","QIZ6LKUUYAX5VGRZAJFEPKF3","GGXBO2RYA3EOEPMVW7UUC4DR","SDHA6SY6OJ42RL6WREN4OQG5","XCKVAMR6VYM4YATHELIUWQVY","PMFQJMWDE3DN5UN5TBXTYSSL","YXOJWTLOZDFRVRAMQFVG2AW3","DPQDDXET5LMDMO6WCEFA2FRF","KS4R5B33YFVGEYAYZYHYNMKS","L6RYPG2Z7VIN6XWAKM7ETXD3","YHDGSQCTD2DYQKX5UERC327N","PP6GYXUE4D67I2FCHENLEGJT","JYHCCHMVV65L4PV5WX5D5CJM"],
    gwIds: ["IITFQUSGJIEHTB2E6IGLKF53", "QTZGYYRXTLEGZF3Y6T6KZSXW", "J3N52PBXXNGNPYF7GEP3FT54", "IEHB5LIG6LLRI3NTOD3ICTAV", "FK5QYQEYF2IOFWTVGTZUK424", "KLINBA6WNNKDJK2RK45BPWH6", "PF2LBJC6EDRQLKVXXZBCSKVP", "H5FIVIPGO5BG6QPY3BTLUZD2", "MGUXUJYLZXJLMGWW7XE2FXKT", "NRKPMB3JURTVTWVVQUKKSKKK", "5P656ZFLMFL7QHESJGOXQN3X", "TMJ2GZGVWSSL3FDP22M3DOYE", "LR2OZ2SIOQSNPYPRF2GZXV2L", "VLK6DBMMP5B56ANXNZ2ZEDMT", "Q5SCHJ3GPWNTVTSRJ4IP4QGT", "BJ75IODUGRNF4H3EATUGMI62", "CIUFQIZJEGEA6Z6VXUIBVU7Y", "6CJKRPOPUC22OKCXPR5HM27J", "352PRFWTEG5R2UUUISY5V5EV", "NVQ4CTYW6EBP7EUGLS3PNUVQ", "PRXLI7RZHKN7WT2LE5BN5CMQ", "AYS6ZFZSVR4L4YR7FOKDLAOP", "W3G3OGENIMTT4K7E5JE5WKUX", "GVBVYEZQS5H23NZOHBD2RZKX", "EOMYADM2ZJZVJ2ENBMGWKHX6", "LR27SWZNQWYRP2UAVD4JEPDZ", "7IOKBYMVUDDWJLZVAOFXSN65", "7TPRLEJA2X2D44LOTSWVRDBN", "EZP55IH7LUOGX4DIG4CKSIKG", "EWEEA57MGLWTC4HYV6AOC3FK", "BTN5UKTXY2ZZFUXXHJMFPKZT", "M5ICCWORS5PA556WKXBOPORT", "BRPJOHF24DZSOXGKXFQPKBZ4", "CTUS7VY4BSDPB3U5PQZYYFGP", "F6PPPL4TY5JBP6MLCCF4ULV7", "VF6AF6IYEQS36R4FFMKPLFMH", "XEMAG5E3N5ERO3USLYJB5FLM", "FRCOSXI2FTYAVDHX5C2IJY6P", "TX6WK4ANPDQN4B2IPLTC4IPT", "3R2RALOPBFNTY6DHXDHG2YDI", "GXRKOB5ARPE4TIMTRGSATOVA", "XAFSN6UZWZDIAYPE6A3OCRHC", "6OK3AZ66TQOONHEPHBXPXETK", "PCMJA62GL3A3JOPNRQWQ6EUG", "C32UH56DAIESAXR2UK62S5S4", "2SGQB5WHCKH2VRHWGOOIBMP7", "4B5PTT6HHENKECVWOE444IH2", "PIF5KRZUJGKFUNRBWSY3GP2N", "RXSL3BEBNJCJ37XZKTPCCYNG", "4IYBUIDZ5AYUBMHA5US253C6"],
    cdIds: ["523O3VV4E63B3ZWEDKCYZIUO", "YCE5PAU5UU3CYJHEBW2UPL6E", "27LPZYFKLZCDNIKL3ECELMQH", "JBZDVZ7LR6Z5C47PNTOIVGXZ", "TAKDCWF6M54YY2S3SGB4BP2V", "ONXJMSCMVQ766I6VMPLLHJ53", "O5HJDKLWR6Q3VJD5SHWD7IEP", "43WD4HEEKGGJIFRRINP36CRN", "B6TC2L6B7SHXSXG5LSJFOPPD", "5WPXQARF4O7XDCC6WAJXMDLQ", "PQJ5SQD7ETPYDDA3HCHL7DL2", "MXCFDM5FRUEXHGDQDQN6OBF6", "K6M2ZI7YVTA3IZLXLXCHRL4R", "6CH255HOECKZYTBUYCHMOWO5", "EO6VXD6Y7ZCCUDOARIGFA475", "YHHKKZAD56VWCBCKHKEQIBMT", "IT7EVK2N2ECHYXVN7NFFZ47I", "ADITFVLCRJWEFESY2N3UKCDG", "BNHG7JVYYYIMH7Q4OPB7Z3IT", "UX47HF2NUEZK25RZXI266PHY", "G3N6ATCHHDRP2ZFF7X673VLC", "GGAXK2X6E7QNR6EPLON7KLKC", "HM2BODX55QURHW4KIAHY4HME", "SJXHO4MR2XLGVOBI7V6RS4G5", "ZYA2SUR5P74UJI2XAUEIQRKF", "WUVOEQVWXNGEEXMYEBWFILFJ", "VUXZYS3CJ4TRCIYS3O2WG4K7", "UGG4ELC7PNQOG6CWR2E26OKT", "UUMNSLUJJP2B5U4XU6NEXWLT", "UXBDIV7JFVORE7M37DYCVCKC", "S6UMNQ6TI54NNCV5DCSZ3LM4", "DM6G5HD37O3QH2FLEYMTQKVY", "W3BEO6RI3WV46THSTY5TPS6P", "RPLVZYSR6N5VI5MMEG2C7O64", "XTR23XX4OFGA6JJ63R7Z4CO4", "KNILES27WPMDZEZ5YWKV32WA", "GRGPVLKCZUD2TDWXULPOYOAV", "GP5K5B6LTCQNCTFBVWYIGKKL", "YXHWAP5HZDH43GZZ43IERFSF", "CM3HJD4ESO7SOY77OIWV5WJS", "JVMXHUB4DUOP6XSSH6F3DJUU", "5RUB4NBT46JWZW5LCWIIWE3C", "ZWQQBFYM5K34NC3VXF6JJP7H", "WKGN6VGD6DPDFD5KBJD4VZTG", "54CKZXB32QRQNWTWHT4TVYPC", "KNXBLNYT6SDKSFH7UKJEBOTG", "2NAYVLFE3SG6JOS44LI6JBSA", "MTZV7BYLEVNA6EAWPCMU72MI", "3AQSMOBLWSMKQTMGIGRSGELF", "NUWHYQSSDJEQD4NJOHQWM762"],
    cdIds2: ["AL5MTFLZCNEJOVDZ6VASMLVJ", "N4TXBN6FJK4KKWSX5LP67QTF", "IEOTCWP7BFG55AKOLDQ5GAXY", "QRVL4EQHHKHMOSGNQ5DJQBM6", "CHJ7O6PD7UAURRJCRR3LHFZI", "AVRRKIWYYTILA6GHUAXGZCYF", "2XU7GV4WKXIB35SZULXDBIF6", "5FI3NXVQ6UNX6WDZ5QJBOBMN", "2HYIUGFY7GEL7B63MXRP7GF7", "PKXZIANVAJISGMC3T72WNEVR", "42UR2AWIHAWPOHH4SB57CMXC", "R3754J4K2BQ7IA62MTXBXMHB"],
    testVersionNumber: 123, // placeholder to be overwritten when needed // todelete..
}

/**
 * Helper method to reset some credentials for Square?
 * 
 */
//@ts-ignore
const setEnvironment = () => { 
    square.accessToken = "EAAAEAc8bQK1bCNQkoHHHqSlwIAiy2gEB-g8EtRqX0EVkYOlITOo_2yeZLsdEgS1";
    square.clientId = "sq0idp-GNJz38YO42bc95-iOPHyLQ";
    CD.categoryId = "SN2VHQBZJGUYI5VKAJPGQUGA";
    GW.categoryId = "LBVNKAIGKBBTVYUUPLQYYPSC";
    CD.locationId = "EX68G9X85NXSX";
    GW.locationId = "9ESY9PNCR27FK";
    CD.ids = ["523O3VV4E63B3ZWEDKCYZIUO", 
    "YCE5PAU5UU3CYJHEBW2UPL6E", 
    "27LPZYFKLZCDNIKL3ECELMQH", 
    "JBZDVZ7LR6Z5C47PNTOIVGXZ", 
    "TAKDCWF6M54YY2S3SGB4BP2V", 
    "ONXJMSCMVQ766I6VMPLLHJ53", 
    "O5HJDKLWR6Q3VJD5SHWD7IEP", 
    "43WD4HEEKGGJIFRRINP36CRN", 
    "B6TC2L6B7SHXSXG5LSJFOPPD", 
    "5WPXQARF4O7XDCC6WAJXMDLQ", 
    "PQJ5SQD7ETPYDDA3HCHL7DL2", 
    "MXCFDM5FRUEXHGDQDQN6OBF6", 
    "K6M2ZI7YVTA3IZLXLXCHRL4R", 
    "6CH255HOECKZYTBUYCHMOWO5", 
    "EO6VXD6Y7ZCCUDOARIGFA475", 
    "YHHKKZAD56VWCBCKHKEQIBMT", 
    "IT7EVK2N2ECHYXVN7NFFZ47I", 
    "ADITFVLCRJWEFESY2N3UKCDG", 
    "BNHG7JVYYYIMH7Q4OPB7Z3IT", 
    "UX47HF2NUEZK25RZXI266PHY", 
    "G3N6ATCHHDRP2ZFF7X673VLC", 
    "GGAXK2X6E7QNR6EPLON7KLKC", 
    "HM2BODX55QURHW4KIAHY4HME", 
    "SJXHO4MR2XLGVOBI7V6RS4G5", 
    "ZYA2SUR5P74UJI2XAUEIQRKF", 
    "WUVOEQVWXNGEEXMYEBWFILFJ", 
    "VUXZYS3CJ4TRCIYS3O2WG4K7", 
    "UGG4ELC7PNQOG6CWR2E26OKT", 
    "UUMNSLUJJP2B5U4XU6NEXWLT", 
    "UXBDIV7JFVORE7M37DYCVCKC", 
    "S6UMNQ6TI54NNCV5DCSZ3LM4", 
    "DM6G5HD37O3QH2FLEYMTQKVY", 
    "W3BEO6RI3WV46THSTY5TPS6P", 
    "RPLVZYSR6N5VI5MMEG2C7O64", 
    "XTR23XX4OFGA6JJ63R7Z4CO4", 
    "KNILES27WPMDZEZ5YWKV32WA", 
    "GRGPVLKCZUD2TDWXULPOYOAV", 
    "GP5K5B6LTCQNCTFBVWYIGKKL", 
    "YXHWAP5HZDH43GZZ43IERFSF", 
    "CM3HJD4ESO7SOY77OIWV5WJS", 
    "JVMXHUB4DUOP6XSSH6F3DJUU", 
    "5RUB4NBT46JWZW5LCWIIWE3C", 
    "ZWQQBFYM5K34NC3VXF6JJP7H", 
    "WKGN6VGD6DPDFD5KBJD4VZTG", 
    "54CKZXB32QRQNWTWHT4TVYPC", 
    "KNXBLNYT6SDKSFH7UKJEBOTG", 
    "2NAYVLFE3SG6JOS44LI6JBSA", 
    "MTZV7BYLEVNA6EAWPCMU72MI", 
    "3AQSMOBLWSMKQTMGIGRSGELF", 
    "NUWHYQSSDJEQD4NJOHQWM762", // Tap 50
    "AL5MTFLZCNEJOVDZ6VASMLVJ", 
    "N4TXBN6FJK4KKWSX5LP67QTF", 
    "IEOTCWP7BFG55AKOLDQ5GAXY", 
    "QRVL4EQHHKHMOSGNQ5DJQBM6", 
    "CHJ7O6PD7UAURRJCRR3LHFZI", 
    "AVRRKIWYYTILA6GHUAXGZCYF", 
    "2XU7GV4WKXIB35SZULXDBIF6", 
    "5FI3NXVQ6UNX6WDZ5QJBOBMN", 
    "2HYIUGFY7GEL7B63MXRP7GF7", 
    "PKXZIANVAJISGMC3T72WNEVR", 
    "42UR2AWIHAWPOHH4SB57CMXC", 
    "R3754J4K2BQ7IA62MTXBXMHB", // Tap 62 (current # of keg taps)
    "FLEVJYCKF47CS6F4CFJ2AB5C",
    "T4ABJ3BZYERD7TJLD53MXJZJ",
    "P7KOA2E7UPZCBOABVGLBB2AC",
    "Z672BOIZY7N2TK2XSUFFJ64H",
    "55UHL5Q2U2XYU7T7SGD5C3UL",
    "BMM7QIT5WTLYPI47UHCAVX6A",
    "ZFT2TLS4LWOSQ2LQN4ZOOOSK",
    "GEDH4AO3IR4BIH4ZASXAGFSN", // Tap 70
    "NSIXMYLR7QRNI3SQ4LKTZQ2Q", 
    "2ABY466FUC6PYAXOJBYRNTN6", 
    "DJFKOGTXD6IGHJED2GJDNLVM", 
    "MERISVWC7EUI3MLGWUMV4XVG",
    "B4CQWBGTIE67BOVUGXZS54V7", // Tap 75
    ];
    GW.ids = ["IITFQUSGJIEHTB2E6IGLKF53", 
    "QTZGYYRXTLEGZF3Y6T6KZSXW", 
    "J3N52PBXXNGNPYF7GEP3FT54", 
    "IEHB5LIG6LLRI3NTOD3ICTAV", 
    "FK5QYQEYF2IOFWTVGTZUK424", 
    "KLINBA6WNNKDJK2RK45BPWH6", 
    "PF2LBJC6EDRQLKVXXZBCSKVP", 
    "H5FIVIPGO5BG6QPY3BTLUZD2", 
    "MGUXUJYLZXJLMGWW7XE2FXKT", 
    "NRKPMB3JURTVTWVVQUKKSKKK", 
    "5P656ZFLMFL7QHESJGOXQN3X", 
    "TMJ2GZGVWSSL3FDP22M3DOYE", 
    "LR2OZ2SIOQSNPYPRF2GZXV2L", 
    "VLK6DBMMP5B56ANXNZ2ZEDMT", 
    "Q5SCHJ3GPWNTVTSRJ4IP4QGT", 
    "BJ75IODUGRNF4H3EATUGMI62", 
    "CIUFQIZJEGEA6Z6VXUIBVU7Y", 
    "6CJKRPOPUC22OKCXPR5HM27J", 
    "352PRFWTEG5R2UUUISY5V5EV", 
    "NVQ4CTYW6EBP7EUGLS3PNUVQ", 
    "PRXLI7RZHKN7WT2LE5BN5CMQ", 
    "AYS6ZFZSVR4L4YR7FOKDLAOP", 
    "W3G3OGENIMTT4K7E5JE5WKUX", 
    "GVBVYEZQS5H23NZOHBD2RZKX", 
    "EOMYADM2ZJZVJ2ENBMGWKHX6", 
    "LR27SWZNQWYRP2UAVD4JEPDZ", 
    "7IOKBYMVUDDWJLZVAOFXSN65", 
    "7TPRLEJA2X2D44LOTSWVRDBN", 
    "EZP55IH7LUOGX4DIG4CKSIKG", 
    "EWEEA57MGLWTC4HYV6AOC3FK", 
    "BTN5UKTXY2ZZFUXXHJMFPKZT", 
    "M5ICCWORS5PA556WKXBOPORT", 
    "BRPJOHF24DZSOXGKXFQPKBZ4", 
    "CTUS7VY4BSDPB3U5PQZYYFGP", 
    "F6PPPL4TY5JBP6MLCCF4ULV7", 
    "VF6AF6IYEQS36R4FFMKPLFMH", 
    "XEMAG5E3N5ERO3USLYJB5FLM", 
    "FRCOSXI2FTYAVDHX5C2IJY6P", 
    "TX6WK4ANPDQN4B2IPLTC4IPT", 
    "3R2RALOPBFNTY6DHXDHG2YDI", 
    "GXRKOB5ARPE4TIMTRGSATOVA", 
    "XAFSN6UZWZDIAYPE6A3OCRHC", 
    "6OK3AZ66TQOONHEPHBXPXETK", 
    "PCMJA62GL3A3JOPNRQWQ6EUG", 
    "C32UH56DAIESAXR2UK62S5S4", 
    "2SGQB5WHCKH2VRHWGOOIBMP7", 
    "4B5PTT6HHENKECVWOE444IH2", 
    "PIF5KRZUJGKFUNRBWSY3GP2N", 
    "RXSL3BEBNJCJ37XZKTPCCYNG", 
    "4IYBUIDZ5AYUBMHA5US253C6", // Tap 50
    "S4EK7WCKAJ73O5IJKNLGBXTK",
    "K7O3AOGTCYPUKFRCNDNKUGD5",
    "25S547KWAASRAOKYEYXPEXXV",
    "PYOHVIT535P72PUURO3CR4IP",
    "DYUBK6QKDBLAAAAWUDJSOBII",
    "W2IUHK36VFK4FPQKEO6L647I",
    "RKLFMMQ2M3FWFC4XS2D56ZAJ",
    "BI2ZXERJFUW55UYVXX2SP5JS",
    "FXVVHVBOTQ3MLIF6DK75LFWB",
    "4TEV6P4NN3QTTAI4Z2WSPXGS",
    "BPQXLGN6LTTSTGSKOU74J7NT",
    "OB2RC5ISEPWNFBIA3RDRU2SK",
    "3YJAHYNGZU4V5YEA724EAY4Z",
    "DABFXDDYKFOOTMTHFAKC4EGD",
    "PSJYATHHOFVQUBNTRZL7WPTM",
    "HW762YH3BC6CL7DDH5I2VGTY",
    "KBKN56OEVUCADLYEI4AAPVOK",
    "OYVXMQEJGPTJXS7ONLZUIMNJ",
    "5BZBXS7HNTBWIWX4X5NZM7KP",
    "KSHKHCEMBPO57TD7IQZYKUAQ",
    "474G25DXIR54GMOE6W5G5VSK",
    "FOZ27D5G5OYC5K4HISNEWS4O",
    "P4OA3HHD4XR6VPU2ZCVPMCNR",
    "CRSCMHBZDSNUR7AFGZM4APDT",
    "A2BDAR762LJAFAN6DJDQXMSG", // Tap 75
    ];
    square.taxId = "RXOC4GJO6NV4EGCZNZY5G64Z";
}




export { Shop, CD, GW, key, token, growlerCalc, minPrice, roundValue, plusValue, markUp, menuHeader, square, posColor, setEnvironment };
