export const swaggerDocument = {
    swagger: '2.0',
    info: {
        title: 'My Bank API',
        description: `Esta API realiza transações bancárias ficticias. Feito em NodeJS com Express, integração ao MongoDB via Mongoose e gravação de logs com Winston. 
        \nFoi construida durante o curso Bootcamp Full Stack do IGTI (Instituto de Gestão e Tecnologia da Informação).
        \n&nbsp;
        \n
        OBS: O "Try It Out" do Swagger não funciona nos métodos GET que utilizam parametros via Body. Utilize Insomnia, Postman ou qualquer API Client para testar.`,
        version: '1.0.0',
    },
    host: 'localhost:3000/accounts',
    tags: [
        {
            name: 'accounts',
            description: 'Operações sobre contas',
        },
    ],
    paths: {
        '/': {
            get: {
                tags: ['accounts'],
                summary: 'Buscar todos clientes',
                description: 'Busca todos os clientes cadastrados na base de dados',
                operationId: 'getAccounts',
                consumes: ['application/json'],
                responses: {
                    '200': {
                        description: 'Clientes cadastrados',
                        schema: {
                            $ref: '#/definitions/Accounts',
                        },
                    },
                    '500': {
                        description: 'Erro interno - Verifique a informação do erro',
                        schema: {
                            $ref: '#/definitions/InternalError',
                        },
                    },
                },
            },
        },
        '/balance': {
            get: {
                tags: ['accounts'],
                summary: 'Consultar o saldo de um cliente',
                description: 'Consulta o saldo de cliente informado agência e conta',
                operationId: 'getBalance',
                consumes: ['application/json'],
                parameters: [
                    {
                        in: 'body',
                        name: 'body',
                        description: 'Informar a agência e conta',
                        required: true,
                        schema: {
                            $ref: '#/definitions/AgenciaConta',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Saldo da conta',
                        schema: {
                            type: 'object',
                            properties: {
                                balance: {
                                    type: 'integer',
                                    example: 605,
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Verifique a informação do erro',
                        schema: {
                            type: 'object',
                            properties: {
                                Error: {
                                    type: 'string',
                                    example: 'Conta informada não existe!',
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Erro interno - Verifique a informação do erro',
                        schema: {
                            $ref: '#/definitions/InternalError',
                        },
                    },
                },
            },
        },
        '/average': {
            get: {
                tags: ['accounts'],
                summary: 'Consultar a média do saldo dos clientes de determinada agência',
                description: 'Busca os saldos de todos os clientes de uma agência informada e retorna a média dos saldos',
                operationId: 'getAverage',
                consumes: ['application/json'],
                parameters: [
                    {
                        in: 'body',
                        name: 'body',
                        description: 'Informar a agência para busca da média',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                agencia: {
                                    type: 'integer',
                                    example: 20,
                                },
                            },
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Média dos saldos',
                        schema: {
                            type: 'object',
                            properties: {
                                average: {
                                    type: 'integer',
                                    example: 949.4666666666667,
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Verifique a informação do erro',
                        schema: {
                            type: 'object',
                            properties: {
                                Error: {
                                    type: 'string',
                                    example: 'Agência informada não existe!',
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Erro interno - Verifique a informação do erro',
                        schema: {
                            $ref: '#/definitions/InternalError',
                        },
                    },
                },
            },
        },
        '/lowestBalances': {
            get: {
                tags: ['accounts'],
                summary: 'Consultar os clientes com o menor saldo em conta',
                description: 'Busca os (n) menores saldos dentre todos os clientes cadastrados',
                operationId: 'getLowestBalance',
                consumes: ['application/json'],
                parameters: [
                    {
                        in: 'body',
                        name: 'body',
                        description: 'Informar a quantidade de clientes que deseja retornar',
                        required: true,
                        schema: {
                            $ref: '#/definitions/Quantity',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Clientes com menor saldo retornados',
                        schema: {
                            type: 'array',
                            items: {
                                type: 'object',
                            },
                            example: [
                                {
                                    agencia: 47,
                                    conta: 2204,
                                    balance: 1,
                                },
                                {
                                    agencia: 10,
                                    conta: 1008,
                                    balance: 1,
                                },
                                {
                                    agencia: 10,
                                    conta: 1006,
                                    balance: 3,
                                },
                            ],
                        },
                    },
                    '400': {
                        description: 'Verifique a informação do erro',
                        schema: {
                            type: 'object',
                            properties: {
                                Error: {
                                    type: 'string',
                                    example: 'Quantidade deve ser positivo!',
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Erro interno - Verifique a informação do erro',
                        schema: {
                            $ref: '#/definitions/InternalError',
                        },
                    },
                },
            },
        },
        '/richestClients': {
            get: {
                tags: ['accounts'],
                summary: 'Consultar os clientes com o maior saldo em conta',
                description: 'Busca os (n) maiores saldos dentre todos os clientes cadastrados',
                operationId: 'getRichestClients',
                consumes: ['application/json'],
                parameters: [
                    {
                        in: 'body',
                        name: 'body',
                        description: 'Informar a quantidade de clientes que deseja retornar',
                        required: true,
                        schema: {
                            $ref: '#/definitions/Quantity',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Clientes com maior saldo retornados',
                        schema: {
                            $ref: '#/definitions/Accounts',
                        },
                    },
                    '400': {
                        description: 'Verifique a informação do erro',
                        schema: {
                            type: 'object',
                            properties: {
                                Error: {
                                    type: 'string',
                                    example: 'Quantidade deve ser positivo!',
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Erro interno - Verifique a informação do erro',
                        schema: {
                            $ref: '#/definitions/InternalError',
                        },
                    },
                },
            },
        },
        '/deposit': {
            patch: {
                tags: ['accounts'],
                summary: 'Depositar valor em conta',
                description: 'Efetua um deposito de X valor informado na conta informada',
                operationId: 'patchDeposit',
                consumes: ['application/json'],
                parameters: [
                    {
                        in: 'body',
                        name: 'body',
                        description: 'Informar os dados da conta a ser efetuado o deposito e o valor',
                        required: true,
                        schema: {
                            $ref: '#/definitions/InfoTransacao',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Saldo atualizado da conta depositada',
                        schema: {
                            $ref: '#/definitions/Balance',
                        },
                    },
                    '400': {
                        description: 'Verifique a informação do erro',
                        schema: {
                            type: 'object',
                            properties: {
                                Error: {
                                    type: 'string',
                                    example: 'Valor de depósito deve ser positivo!',
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Verifique a informação do erro',
                        schema: {
                            type: 'object',
                            properties: {
                                Error: {
                                    type: 'string',
                                    example: 'Conta informada não existe!',
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Erro interno - Verifique a informação do erro',
                        schema: {
                            $ref: '#/definitions/InternalError',
                        },
                    },
                },
            },
        },
        '/withdraw': {
            patch: {
                tags: ['accounts'],
                summary: 'Sacar valor de uma conta',
                description: 'Efetua um saque de X valor informado na conta informada',
                operationId: 'patchWithdraw',
                consumes: ['application/json'],
                parameters: [
                    {
                        in: 'body',
                        name: 'body',
                        description: 'Informar os dados da conta a ser efetuado o saque e o valor',
                        required: true,
                        schema: {
                            $ref: '#/definitions/InfoTransacao',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Saldo atualizado da conta sacada',
                        schema: {
                            $ref: '#/definitions/Balance',
                        },
                    },
                    '400': {
                        description: 'Verifique a informação do erro',
                        schema: {
                            type: 'object',
                            properties: {
                                Error: {
                                    type: 'string',
                                    example: 'Valor de saque deve ser positivo!',
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Verifique a informação do erro',
                        schema: {
                            type: 'object',
                            properties: {
                                Error: {
                                    type: 'string',
                                    example: 'Conta informada não existe!',
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Erro interno - Verifique a informação do erro',
                        schema: {
                            $ref: '#/definitions/InternalError',
                        },
                    },
                },
            },
        },
        '/close': {
            delete: {
                tags: ['accounts'],
                summary: 'Fechar uma conta',
                description: 'Fecha uma conta informada apagando todos os dados da conta',
                operationId: 'deleteClose',
                consumes: ['application/json'],
                parameters: [
                    {
                        in: 'body',
                        name: 'body',
                        description: 'Informar os dados da conta a ser fechada',
                        required: true,
                        schema: {
                            $ref: '#/definitions/AgenciaConta',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Número de contas ainda ativas da agência informada',
                        schema: {
                            type: 'object',
                            properties: {
                                contasAtivas: {
                                    type: 'integer',
                                    example: 26,
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Verifique a informação do erro',
                        schema: {
                            type: 'object',
                            properties: {
                                Error: {
                                    type: 'string',
                                    example: 'Conta informada não existe!',
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Erro interno - Verifique a informação do erro',
                        schema: {
                            $ref: '#/definitions/InternalError',
                        },
                    },
                },
            },
        },
        '/transfer': {
            post: {
                tags: ['accounts'],
                summary: 'Transferir valor entre contas',
                description: 'Efetua uma transferência de X valor informado da conta origem para conta destino',
                operationId: 'postTransfer',
                consumes: ['application/json'],
                parameters: [
                    {
                        in: 'body',
                        name: 'body',
                        description: 'Informe o número da conta origem, da conta destino e o valor a ser transferido',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                contaOrigem: {
                                    type: 'integer',
                                    example: 1001,
                                },
                                contaDestino: {
                                    type: 'integer',
                                    example: 3012,
                                },
                                valor: {
                                    type: 'integer',
                                    example: 100,
                                },
                            },
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Saldo atualizado da conta origem',
                        schema: {
                            $ref: '#/definitions/Balance',
                        },
                    },
                    '400': {
                        description: 'Verifique a informação do erro',
                        schema: {
                            type: 'object',
                            properties: {
                                Error: {
                                    type: 'string',
                                    example: 'Valor de saque deve ser positivo!',
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Verifique a informação do erro',
                        schema: {
                            type: 'object',
                            properties: {
                                Error: {
                                    type: 'string',
                                    example: 'Conta destino não existe!',
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Erro interno - Verifique a informação do erro',
                        schema: {
                            $ref: '#/definitions/InternalError',
                        },
                    },
                },
            },
        },
        '/privateClients': {
            put: {
                tags: ['accounts'],
                summary: 'Clientes mais ricos para agência Private',
                description: 'Muda a agência dos clientes mais ricos de cada agência para a agência Private 99',
                operationId: 'putPrivateClients',
                consumes: ['application/json'],
                responses: {
                    '200': {
                        description: 'Clientes da agência Private 99 retornados',
                        schema: {
                            $ref: '#/definitions/Accounts',
                        },
                    },
                    '500': {
                        description: 'Erro interno - Verifique a informação do erro',
                        schema: {
                            $ref: '#/definitions/InternalError',
                        },
                    },
                },
            },
        },
    },
    definitions: {
        Accounts: {
            type: 'array',
            items: {
                type: 'object',
            },
            example: [
                {
                    agencia: 10,
                    conta: 1001,
                    name: 'Maria Roberta Fernandes',
                    balance: 587,
                },
                {
                    agencia: 10,
                    conta: 1002,
                    name: 'Gustavo Falcao Oliveira',
                    balance: 396,
                },
                {
                    agencia: 10,
                    conta: 1003,
                    name: 'Fernando Carlos Silva',
                    balance: 500,
                },
                {
                    agencia: 10,
                    conta: 1004,
                    name: 'Aline Batista Bernardes',
                    balance: 321,
                },
            ],
        },
        Quantity: {
            type: 'object',
            properties: {
                quant: {
                    type: 'integer',
                    example: 3,
                },
            },
        },
        Balance: {
            type: 'object',
            properties: {
                balance: {
                    type: 'integer',
                    example: 367,
                },
            },
        },
        AgenciaConta: {
            type: 'object',
            properties: {
                agencia: {
                    type: 'integer',
                    example: 10,
                },
                conta: {
                    type: 'integer',
                    example: 1001,
                },
            },
        },
        InfoTransacao: {
            type: 'object',
            properties: {
                agencia: {
                    type: 'integer',
                    example: 10,
                },
                conta: {
                    type: 'integer',
                    example: 1001,
                },
                valor: {
                    type: 'integer',
                    example: 255,
                },
            },
        },
        InternalError: {
            type: 'object',
            properties: {
                Error: {
                    type: 'string',
                    example: 'Invalid status code: 567',
                },
            },
        },
    },
};
