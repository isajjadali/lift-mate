module.exports = {
    up: (queryInterface) =>
        queryInterface.bulkInsert(
            'users',
            [
                {
                    first_name: 'Sajjad',
                    last_name: 'Ali',
                    email: 'admin@gmail.com',
                    phone_number: '1-(923)-244-4051',
                    password: 'mz1/OwmwJhdWVw5cuCpik4S+XraZa2BcOkKuhkPbmPs=', // password is `sajjad734`
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    first_name: 'Ferasat',
                    last_name: 'Ali',
                    email: 'driver@gmail.com',
                    phone_number: '1-(923)-244-4052',
                    password: 'mz1/OwmwJhdWVw5cuCpik4S+XraZa2BcOkKuhkPbmPs=', // password is `sajjad734`
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    first_name: 'Basit',
                    last_name: 'Ali',
                    email: 'customer@gmail.com',
                    phone_number: '1-(923)-244-4053',
                    password: 'mz1/OwmwJhdWVw5cuCpik4S+XraZa2BcOkKuhkPbmPs=', // password is `sajjad734`
                    created_at: new Date(),
                    updated_at: new Date(),
                }, 
                {
                    first_name: 'Asad',
                    last_name: 'hussain',
                    email: 'seo@gmail.com',
                    phone_number: '1-(923)-244-4053',
                    password: 'mz1/OwmwJhdWVw5cuCpik4S+XraZa2BcOkKuhkPbmPs=', // password is `sajjad734`
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        ),

    down: (queryInterface) =>
        queryInterface.bulkDelete(
            'users',
            [
                {
                    first_name: 'Sajjad',
                    last_name: 'Ali',
                    email: 'admin@gmail.com',
                    phone_number: '1-(923)-244-4051',
                    password: 'mz1/OwmwJhdWVw5cuCpik4S+XraZa2BcOkKuhkPbmPs=', // password is `sajjad734`
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    first_name: 'Ferasat',
                    last_name: 'Ali',
                    email: 'driver@gmail.com',
                    phone_number: '1-(923)-244-4052',
                    password: 'mz1/OwmwJhdWVw5cuCpik4S+XraZa2BcOkKuhkPbmPs=', // password is `sajjad734`
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    first_name: 'Basit',
                    last_name: 'Ali',
                    email: 'customer@gmail.com',
                    phone_number: '1-(923)-244-4053',
                    password: 'mz1/OwmwJhdWVw5cuCpik4S+XraZa2BcOkKuhkPbmPs=', // password is `sajjad734`
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    first_name: 'Asad',
                    last_name: 'hussain',
                    email: 'seo@gmail.com',
                    phone_number: '1-(923)-244-4053',
                    password: 'mz1/OwmwJhdWVw5cuCpik4S+XraZa2BcOkKuhkPbmPs=', // password is `sajjad734`
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        ),
};


