#[DAM-NFSE](https://github.com/giryco/dam)
> Geração de Documento de Arrecadação Municipal

##Instalação
```
npm install --save dam-nfse@latest
```

##Exemplos de utilização
```
const dam = require('../../index');
const object = {
    codigoMunicipio: 4314902,
    logoEmpresa: 'https://icon2.kisspng.com/20171221/see/phoenix-logo-vector-design-5a3c31b00e5f48.7862516515138943200589.jpg'
}

const xmlNfse = `<?xml version=\'1.0\' encoding=\'UTF-8\'?><S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/"><S:Body><ns2:ConsultarNfsePorRpsResponse xmlns:ns2="http://ws.bhiss.pbh.gov.br"><outputXML><?xml version=\'1.0\' encoding=\'UTF-8\'?><ConsultarNfseRpsResposta xmlns="http://www.abrasf.org.br/nfse.xsd"><CompNfse xmlns="http://www.abrasf.org.br/nfse.xsd"><Nfse xmlns="http://www.abrasf.org.br/nfse.xsd" versao="1.00"><InfNfse Id="nfse">RETORNO XML DE WEBSERVICE DAS PREFEITURAS PARA O SERVIÇO CONSULTAR NFSE POR RPS</InfNfse></Nfse></CompNfse></ConsultarNfseRpsResposta></outputXML></ns2:ConsultarNfsePorRpsResponse></S:Body></S:Envelope>`;

const pathToPdf = '/home/ofm/Documentos/pdf';

dam.dam(object, xmlNfse, pathToPdf);
```