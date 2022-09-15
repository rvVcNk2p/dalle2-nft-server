export const dummyGenerations = () => {
    const randomNum = Math.floor(Math.random() * 2) // Random number between 0 and 1
    switch(randomNum) {
        case 0:
        return dummyData_0
        case 1:
        return dummyData_1
    }
};

const dummyData_0 = {
    data: [
        {
            id: "generation-qM0FkuhBKrezdyMZO6AaXyP7",
            object: "generation",
            created: 1663278411,
            generation_type: "ImageGeneration",
            generation: {
                image_path: "https://cdn.openai.com/labs/images/A%20van%20Gogh%20style%20painting%20of%20an%20American%20football%20player.webp?v=1"
            },
            task_id: "task-Y8c4uXSevsfw5oqArr1cWv9B",
            prompt_id: "prompt-OiJbVVeJ7KiSNrIkwpzeUzeO",
            is_public: false
        },
        {
            id: "generation-babcPFySTVpPVh5s8hlrHvQp",
            object: "generation",
            created: 1663278413,
            generation_type: "ImageGeneration",
            generation: {
                image_path: "https://cdn.openai.com/labs/images/High%20quality%20photo%20of%20a%20monkey%20astronaut.webp?v=1"
            },
            task_id: "task-Y8c4uXSevsfw5oqArr1cWv9B",
            prompt_id: "prompt-OiJbVVeJ7KiSNrIkwpzeUzeO",
            is_public: false
        },
        {
            id: "generation-doE2FDn0KHIk2wL2MpkyrMLB",
            object: "generation",
            created: 1663278413,
            generation_type: "ImageGeneration",
            generation: {
                image_path: "https://cdn.openai.com/labs/images/An%20abstract%20painting%20of%20artificial%20intelligence.webp?v=1"
            },
            task_id: "task-Y8c4uXSevsfw5oqArr1cWv9B",
            prompt_id: "prompt-OiJbVVeJ7KiSNrIkwpzeUzeO",
            is_public: false
        },
        {
            id: "generation-Ne9W0WFbgqTxp2V66k2yzKxB",
            object: "generation",
            created: 1663278411,
            generation_type: "ImageGeneration",
            generation: {
                image_path: "https://cdn.openai.com/labs/images/An%20Andy%20Warhol%20style%20painting%20of%20a%20french%20bulldog%20wearing%20sunglasses.webp?v=1"
            },
            task_id: "task-Y8c4uXSevsfw5oqArr1cWv9B",
            prompt_id: "prompt-OiJbVVeJ7KiSNrIkwpzeUzeO",
            is_public: false
        }
    ]
}

const dummyData_1 = {
    data: [
        {
            id: "generation-UklyjMdHZ3hlMBgM77u5wk8n",
            object: "generation",
            created: 1663278987,
            generation_type: "ImageGeneration",
            generation: {
                image_path: "https://cdn.openai.com/labs/images/A%20comic%20book%20cover%20of%20a%20superhero%20wearing%20headphones.webp?v=1"
            },
            task_id: "task-r4A4kYuwax41ZaGbgIuib5ah",
            prompt_id: "prompt-tVnNZ7bJFerRfAEHXOiQMtgS",
            is_public: false
        },
        {
            id: "generation-OvPWHs2atywuKUT6JQ6twTsj",
            object: "generation",
            created: 1663278987,
            generation_type: "ImageGeneration",
            generation: {
                image_path: "https://cdn.openai.com/labs/images/An%20oil%20pastel%20drawing%20of%20an%20annoyed%20cat%20in%20a%20spaceship.webp?v=1"
            },
            task_id: "task-r4A4kYuwax41ZaGbgIuib5ah",
            prompt_id: "prompt-tVnNZ7bJFerRfAEHXOiQMtgS",
            is_public: false
        },
        {
            id: "generation-i2w9ez6IhCxxw8EMVbBxc4va",
            object: "generation",
            created: 1663278985,
            generation_type: "ImageGeneration",
            generation: {
                image_path: "https://cdn.openai.com/labs/images/A%20centered%20explosion%20of%20colorful%20powder%20on%20a%20black%20background.webp?v=1"
            },
            task_id: "task-r4A4kYuwax41ZaGbgIuib5ah",
            prompt_id: "prompt-tVnNZ7bJFerRfAEHXOiQMtgS",
            is_public: false
        },
        {
            id: "generation-Rrn0eRO6wyNHNdfiVyqSBlJO",
            object: "generation",
            created: 1663278985,
            generation_type: "ImageGeneration",
            generation: {
                image_path: "https://cdn.openai.com/labs/images/An%20abstract%20oil%20painting%20of%20a%20river.webp?v=1"
            },
            task_id: "task-r4A4kYuwax41ZaGbgIuib5ah",
            prompt_id: "prompt-tVnNZ7bJFerRfAEHXOiQMtgS",
            is_public: false
        }
    ]
}