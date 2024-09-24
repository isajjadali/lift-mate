const { S3_AWS_URL } = process.env;

module.exports = {
    up: (queryInterface) =>
        queryInterface.bulkInsert(
            'cars',
            [
                {
                    name: 'SUV',
                    to_multiply: '3.22',
                    to_add: '15',
                    image_url:
            `${S3_AWS_URL}/1000002872-removebg-preview.png`,
                    aws_object_key: '1000002872-removebg-preview.png',
                    minimum_rate: '64',
                    is_active: true,
                    quantity: '6',
                    max_passenger: '6',
                    max_Bags: '4',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'SEDAN',
                    to_multiply: '2.79',
                    to_add: '10',
                    image_url:
            `${S3_AWS_URL}/1000002875-removebg-preview.png`,
                    aws_object_key: '1000002875-removebg-preview.png',
                    minimum_rate: '54',
                    is_active: true,
                    quantity: '6',
                    max_passenger: '4',
                    max_Bags: '3',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'SPRINTER',
                    to_multiply: '4.9',
                    to_add: '40',
                    image_url:
            `${S3_AWS_URL}/1000003204-removebg-preview.png`,
                    aws_object_key: '1000003204-removebg-preview.png',
                    minimum_rate: '130',
                    is_active: true,
                    quantity: '3',
                    max_passenger: '11',
                    max_Bags: '11',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        ),

    down: (queryInterface) =>
        queryInterface.bulkDelete(
            'cars',
            [
                {
                    name: 'SUV',
                    to_multiply: '3.22',
                    to_add: '15',
                    image_url:
            `${S3_AWS_URL}/1000002872-removebg-preview.png`,
                    aws_object_key: '1000002872-removebg-preview.png',
                    minimum_rate: '64',
                    is_active: true,
                    quantity: '6',
                    max_passenger: '6',
                    max_Bags: '4',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'SEDAN',
                    to_multiply: '2.79',
                    to_add: '10',
                    image_url:
            `${S3_AWS_URL}/1000002875-removebg-preview.png`,
                    aws_object_key: '1000002875-removebg-preview.png',
                    minimum_rate: '54',
                    is_active: true,
                    quantity: '6',
                    max_passenger: '4',
                    max_Bags: '3',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'SPRINTER',
                    to_multiply: '4.9',
                    to_add: '40',
                    image_url:
            `${S3_AWS_URL}/1000003204-removebg-preview.png`,
                    aws_object_key: '1000003204-removebg-preview.png',
                    minimum_rate: '130',
                    is_active: true,
                    quantity: '3',
                    max_passenger: '11',
                    max_Bags: '11',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        ),
};


