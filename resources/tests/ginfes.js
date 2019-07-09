const dam = require('../../index');
const object = {
    codigoMunicipio: 3523909,
    logoEmpresa: 'https://icon2.kisspng.com/20171221/see/phoenix-logo-vector-design-5a3c31b00e5f48.7862516515138943200589.jpg'
}

const xmlNfse = `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ns1:ConsultarNfsePorRpsV3 xmlns:ns1="http://homologacao.ginfes.com.br"><arg0><ns2:cabecalho versao="3" xmlns:ns2="http://www.ginfes.com.br/cabecalho_v03.xsd"><versaoDados>3</versaoDados></ns2:cabecalho></arg0><arg1><ns3:ConsultarNfseRpsEnvio xmlns:ns3="http://www.ginfes.com.br/servico_consultar_nfse_rps_envio_v03.xsd" xmlns:ns4="http://www.ginfes.com.br/tipos_v03.xsd"><ns3:IdentificacaoRps><ns4:Numero>58076515619</ns4:Numero><ns4:Serie>RPS</ns4:Serie><ns4:Tipo>1</ns4:Tipo></ns3:IdentificacaoRps><ns3:Prestador><ns4:Cnpj>17845667000198</ns4:Cnpj><ns4:InscricaoMunicipal>25099</ns4:InscricaoMunicipal></ns3:Prestador><Signature xmlns="http://www.w3.org/2000/09/xmldsig#"><SignedInfo><CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/><SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/><Reference URI=""><Transforms><Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/><Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/></Transforms><DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/><DigestValue>AsLmsQ81zK8NIWrDr7GkFUBBUDM=</DigestValue></Reference></SignedInfo><SignatureValue>w4/M/3D7vofF1KvO4IAASyYfyA2uUEuy9H1t2hNOVCojv3BnLkZFmyRYopsAKEbc7SjCJYE8Y8mHyVolXzsmso9jZqL9TQRBT4s6abmmiRxTtgYvLYhvxhif9gw4a1sForIBwh+sSjY3MaDSnZe1HetB7uZ6KFgIYCERl2hDl155MZzmvTIZnOTzZl4qmvnLbdwbwkbnDOOOm2tIgaTkIN1lJ9m9rW4iN6gaZPomem5opG1HdabckqZeucpSahHivrDOIst2pn8AEKXjl0bmA5TpDWNTnMKwpYLJjvy2JSNCIKoogjjGd4EAFedUG35IirGTnqhINUeEQhFRB3+Xag==</SignatureValue><KeyInfo><X509Data><X509Certificate>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</X509Certificate></X509Data></KeyInfo></Signature></ns3:ConsultarNfseRpsEnvio></arg1></ns1:ConsultarNfsePorRpsV3></soap:Body></soap:Envelope>`;

const pathToPdf = '/home/ofm/Documentos/pdf';

dam.dam(object, xmlNfse, pathToPdf);