const dam = require('./index');
const object = {
    codigoMunicipio: 4314902,
    logoEmpresa: 'https://icon2.kisspng.com/20171221/see/phoenix-logo-vector-design-5a3c31b00e5f48.7862516515138943200589.jpg'
}

const xmlNfse = `<?xml version='1.0' encoding='UTF-8'?><S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/"><S:Body><ns2:ConsultarLoteRpsResponse xmlns:ns2="http://ws.bhiss.pbh.gov.br"><outputXML><?xml version='1.0' encoding='UTF-8'?><ConsultarLoteRpsResposta xmlns="http://www.abrasf.org.br/nfse.xsd"><ListaNfse><CompNfse xmlns="http://www.abrasf.org.br/nfse.xsd"><Nfse xmlns="http://www.abrasf.org.br/nfse.xsd" versao="1.00"><InfNfse Id="nfse"><Numero>201900000000100</Numero><CodigoVerificacao>2961ab69</CodigoVerificacao><DataEmissao>2019-07-04T14:34:25</DataEmissao><IdentificacaoRps><Numero>1562261645075</Numero><Serie>RPS</Serie><Tipo>1</Tipo></IdentificacaoRps><DataEmissaoRps>2019-03-19</DataEmissaoRps><NaturezaOperacao>1</NaturezaOperacao><OptanteSimplesNacional>2</OptanteSimplesNacional><IncentivadorCultural>2</IncentivadorCultural><Competencia>2019-03-19T09:17:00</Competencia><OutrasInformacoes>NFS-e gerada em ambiente de teste. NÃO TEM VALOR JURÍDICO NEM FISCAL.</OutrasInformacoes><Servico><Valores><ValorServicos>105.00</ValorServicos><IssRetido>2</IssRetido><ValorIss>5.25</ValorIss><BaseCalculo>105.00</BaseCalculo><Aliquota>0.05</Aliquota><ValorLiquidoNfse>105.00</ValorLiquidoNfse></Valores><ItemListaServico>11.04</ItemListaServico><CodigoTributacaoMunicipio>110400100</CodigoTributacaoMunicipio><Discriminacao>Carga, descarga e arrumação de bens de qualquer espécie</Discriminacao><CodigoMunicipio>4314902</CodigoMunicipio></Servico><PrestadorServico><IdentificacaoPrestador><Cnpj>26390085000317</Cnpj><InscricaoMunicipal>28770820</InscricaoMunicipal></IdentificacaoPrestador><RazaoSocial>ENDOLOG LOGISTICA E ARMAZENS LTDA</RazaoSocial><Endereco><Endereco>AV  FRANCISCO SILVEIRA BITENCOURT</Endereco><Numero>1369</Numero><Complemento>Pavilhão 26</Complemento><Bairro>SARANDI</Bairro><CodigoMunicipio>4314902</CodigoMunicipio><Uf>RS</Uf><Cep>91150010</Cep></Endereco></PrestadorServico><TomadorServico><IdentificacaoTomador><CpfCnpj><Cnpj>33423401000103</Cnpj></CpfCnpj><InscricaoMunicipal>00475076</InscricaoMunicipal></IdentificacaoTomador><RazaoSocial>ABC AGENCIA BRASILEIRA DE COMERCIO E TURISMO LTDA</RazaoSocial><Endereco><Endereco>RUA DA AJUDA, SAL COB 01</Endereco><Numero>35</Numero><Bairro>centro</Bairro><CodigoMunicipio>3304557</CodigoMunicipio><Uf>RJ</Uf><Cep>20040915</Cep></Endereco><Contato><Telefone>2122422427</Telefone><Email>robertamartins@mtravel.com.br</Email></Contato></TomadorServico><OrgaoGerador><CodigoMunicipio>4314902</CodigoMunicipio><Uf>RS</Uf></OrgaoGerador></InfNfse><Signature xmlns="http://www.w3.org/2000/09/xmldsig#" Id="NfseAssSMF_nfse"><SignedInfo><CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/><SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/><Reference URI="#nfse"><Transforms><Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/><Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/></Transforms><DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/><DigestValue>RIYrGl6BKm46qTfZ5VQ2LhSg/Rk=</DigestValue></Reference></SignedInfo><SignatureValue>nzhxDE49w+qCYSMM/0uTErcoHhdP8rNd11FgXo5dyhHRvkZ2/HReg7R7Lht1egS8YNWdrOMPuOLC
dRPR8N7IHZ1TjUiTnwKdDzJW8Ahj//gO7XziHkwDvoLEiWt14hx+5IL1ApLCDkCzL2gZBybhSF1d
9/VFriQntmuzjNWJ4KBh9+z1CBinzrcMk2OCacD1fmVbLDhq+mkEO4gfFEZDodNXy1IpQHyjTio0
mdKnAA0oR3mFMNsl0ZhOTvsR2QUTpUXrjHY6g895Hr7z3ejSp4P6vINF/dGBbEKvZEHTmveY5sWn
ML2ym5ImI2g9GO6ZA+HnGJbjPtBWBrJILUsAMw==</SignatureValue><KeyInfo><X509Data><X509Certificate>MIIHrDCCBZSgAwIBAgIIUrBpasArj8MwDQYJKoZIhvcNAQELBQAwdjELMAkGA1UEBhMCQlIxEzAR
BgNVBAoTCklDUC1CcmFzaWwxNjA0BgNVBAsTLVNlY3JldGFyaWEgZGEgUmVjZWl0YSBGZWRlcmFs
IGRvIEJyYXNpbCAtIFJGQjEaMBgGA1UEAxMRQUMgU0FGRVdFQiBSRkIgdjUwHhcNMTgxMjI2MTE1
NTE1WhcNMTkxMjI2MTE1NTE1WjCB3jELMAkGA1UEBhMCQlIxEzARBgNVBAoTCklDUC1CcmFzaWwx
CzAJBgNVBAgTAlJTMRUwEwYDVQQHEwxQT1JUTyBBTEVHUkUxNjA0BgNVBAsTLVNlY3JldGFyaWEg
ZGEgUmVjZWl0YSBGZWRlcmFsIGRvIEJyYXNpbCAtIFJGQjEWMBQGA1UECxMNUkZCIGUtQ05QSiBB
MTETMBEGA1UECxMKQVIgU0FGRVdFQjExMC8GA1UEAxMoTVVOSUNJUElPIERFIFBPUlRPIEFMRUdS
RTo5Mjk2MzU2MDAwMDE2MDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALcUoQrvS77P
molUWc+i50hcEBoOZEZ1FDy+ej1TreccpeT7o4B4dOPXP3mVJ7PK2Z2MFuq2t7Z04qDBXxUdODk8
ZRncLFz6AiWu5GhbscXkQHmOvgZO4Qbot21NxD3m31eOJ5ETOEOanqsTH/d8AqwkKpj3v1AyAgzv
jmMPQXCX5GOaDylMg7DAW5spZmRl+7K46BwHj8yxyhf4i3dnlvs1y5rv8akK5xcMXbHlP/xDdK7b
i3GkK8KMmFTZh9d1PkW9faObWzLxq/8stLqfbTn74AS32n8qUWiRXBoDnvUN0goQtsMFwihVyh2t
onVNv6cbJh/KV0HpQuPsKH1XxW0CAwEAAaOCAtMwggLPMB8GA1UdIwQYMBaAFCleS9VGTLv+Fqdj
wR3EJvLd2PMFMA4GA1UdDwEB/wQEAwIF4DBtBgNVHSAEZjBkMGIGBmBMAQIBMzBYMFYGCCsGAQUF
BwIBFkpodHRwOi8vcmVwb3NpdG9yaW8uYWNzYWZld2ViLmNvbS5ici9hYy1zYWZld2VicmZiL2Fj
LXNhZmV3ZWItcmZiLXBjLWExLnBkZjCBrgYDVR0fBIGmMIGjME+gTaBLhklodHRwOi8vcmVwb3Np
dG9yaW8uYWNzYWZld2ViLmNvbS5ici9hYy1zYWZld2VicmZiL2xjci1hYy1zYWZld2VicmZidjUu
Y3JsMFCgTqBMhkpodHRwOi8vcmVwb3NpdG9yaW8yLmFjc2FmZXdlYi5jb20uYnIvYWMtc2FmZXdl
YnJmYi9sY3ItYWMtc2FmZXdlYnJmYnY1LmNybDCBiwYIKwYBBQUHAQEEfzB9MFEGCCsGAQUFBzAC
hkVodHRwOi8vcmVwb3NpdG9yaW8uYWNzYWZld2ViLmNvbS5ici9hYy1zYWZld2VicmZiL2FjLXNh
ZmV3ZWJyZmJ2NS5wN2IwKAYIKwYBBQUHMAGGHGh0dHA6Ly9vY3NwLmFjc2FmZXdlYi5jb20uYnIw
gcMGA1UdEQSBuzCBuIEkRkFUSU1BLkFaRVJFRE9AUE9SVE9BTEVHUkUuUlMuR09WLkJSoCIGBWBM
AQMCoBkTF05FTFNPTiBNQVJDSEVaQU4gSlVOSU9SoBkGBWBMAQMDoBATDjkyOTYzNTYwMDAwMTYw
oDgGBWBMAQMEoC8TLTMwMTExOTcxNjQ3NzcxNTQwNjgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw
MKAXBgVgTAEDB6AOEwwwMDAwMDAwMDAwMDAwHQYDVR0lBBYwFAYIKwYBBQUHAwIGCCsGAQUFBwME
MAkGA1UdEwQCMAAwDQYJKoZIhvcNAQELBQADggIBAFjSGperaw7LmOYDKT890h1PgrZ+Bzn+r638
7wS7AVlhKEF5E+H6iW/JAi4Tqtn45HeF8ifp9aFCN4EAJ55pLyEUIi9Qwtk85gMEUUQ4wYAZ7iGe
ShK8GAw3aFldL9VGEIk7TdeAtH2fO4cvijXoLVlKUw5AjFsOBBqCB0oWVY3fZiN9+z9NRb2gaAZ+
ty1+PqQokQK8N65eCGOm8f4h1Lb9EtH5SQY+Q02Ncppa6R3HsneFxZSS62DCRvExnh/einxTcKG0
1sDKVSyZ0xygzGKdPuYUm5vm9WGWcMTlGXmaBs/CjxcZhT93gr03qYYUphd9Flu6o7Qwp8ODrXJE
xVpOlskqLLSyxI5D/zGSWaFgly7sNjRGp7qdlD8UA3xojTlJLMiKShzKtYEmoZVcq41WUtYB0PLy
/xVE0+F905nIgd8crUta0phPvGWbpL2LuXeZfTlC0G51bES4zhYnaH4b0/Kkkwl248s9wr3tsV8X
ztKZSDysR3BV4NGfJRcsIZiaTE+1JyvRMDHktCbtIUzQYbWW09VmeUVQhFNSTKMAExntBRGliqte
NoyV10UF+hEHh/62JtJcJOR3SAqvS5PUMYPqw2wo3Xg2FTbjbJjahJk2YsZW+UWSlnnDoa53HdMU
ViNjnWm/bnXJyn2qwNCCQNHp1KDa+W2B3/odoual</X509Certificate></X509Data></KeyInfo></Signature></Nfse></CompNfse></ListaNfse></ConsultarLoteRpsResposta></outputXML></ns2:ConsultarLoteRpsResponse></S:Body></S:Envelope>`;

const pathToPdf = '/home/ofm/Documentos/pdf';

dam.dam(object, xmlNfse, pathToPdf);