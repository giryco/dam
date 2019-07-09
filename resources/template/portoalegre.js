const populateDam = (populateTemplate, object, city) => {
    return new Promise((resolve, reject) => {
        try {
            var somaDesconto = populateTemplate.servico['valores']['descontoCondicionado'] + populateTemplate.servico['valores']['descontoIncondicionado'];
            var somaRetencoesFederais = populateTemplate.servico['valores']['valorCsll'] + populateTemplate.servico['valores']['valorPis'] + populateTemplate.servico['valores']['valorCofins'] + populateTemplate.servico['valores']['valorIr'] + populateTemplate.servico['valores']['valorInss'];
            var desconto = parseFloat(somaDesconto, 2);
            var retencaoCalculo = somaRetencoesFederais * populateTemplate.servico['valores']['baseCalculo'];
            var retencaoFederal = parseFloat(retencaoCalculo, 2);
            var issRetido = 'Sim';

            if (populateTemplate.servico['valores']['issRetido'] !== 1) {
                issRetido = 'Não';
            }
            
            const html =    `<!DOCTYPE html>
                            <html lang="en">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                                <title>Document</title>
                                <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
                            
                                <style>
                                /**
                                 * RESET: start
                                 */
                                html, body, div, span, applet, object, iframe,
                                h1, h2, h3, h4, h5, h6, p, blockquote, pre,
                                a, abbr, acronym, address, big, cite, code,
                                del, dfn, em, img, ins, kbd, q, s, samp,
                                small, strike, strong, sub, sup, tt, var,
                                b, u, i, center,
                                dl, dt, dd, ol, ul, li,
                                fieldset, form, label, legend,
                                table, caption, tbody, tfoot, thead, tr, th, td,
                                article, aside, canvas, details, embed, 
                                figure, figcaption, footer, header, hgroup, 
                                menu, nav, output, ruby, section, summary,
                                time, mark, audio, video {
                                    margin: 0;
                                    padding: 0;
                                    border: 0;
                                    font-size: 100%;
                                    font: inherit;
                                    vertical-align: baseline;
                                }
                                /* HTML5 display-role reset for older browsers */
                                article, aside, details, figcaption, figure, 
                                footer, header, hgroup, menu, nav, section {
                                    display: block;
                                }
                                html { zoom: 0.65 }
                                body {
                                    line-height: 1;
                                }
                                ol, ul {
                                    list-style: none;
                                }
                                blockquote, q {
                                    quotes: none;
                                }
                                blockquote:before, blockquote:after,
                                q:before, q:after {
                                    content: '';
                                    content: none;
                                }
                                table {
                                    border-collapse: collapse;
                                    border-spacing: 0;
                                }
                                /**
                                 * RESET: end
                                 */
                                
                                body {
                                    font-family: 'Open Sans', sans-serif;
                                    font-size: 14px;
                                    height: 100%;
                                    border: solid 1px rgb(104, 136, 167);
                                }
                        
                                #main {
                                    width: 100%;
                                    margin: auto;
                                }
                        
                                #top-bar {
                                    width: 100%;
                                    text-align: center;
                                    font-size: 16px;
                                    padding: 10px 0;
                                    background-clip: border-box;
                                    background: rgb(226, 226, 226);
                                }
                        
                                #nfse-area {
                                    width: 100%;
                                    display: -webkit-flex;
                                }
                        
                                #nfse-number {
                                    width: 40%;
                                    font-size: 22px;
                                    padding: 5px 0 5px 10px;
                                    border-right: solid 1px rgb(104, 136, 167);
                                }
                        
                                #nfse-date {
                                    width: 20%;
                                    padding: 0 0 0 10px;
                                    border-right: solid 1px rgb(104, 136, 167);
                                }
                        
                                #nfse-date p:nth-child(1) {
                                    margin: 5px 0 0 0;
                                    font-size: 10px;
                                    line-height: 10px;
                                }
                        
                                #nfse-date span:nth-child(1) {
                                    font-size: 10px;
                                }
                        
                                #nfse-competence {
                                    width: 20%;
                                    padding: 0 0 0 10px;
                                    border-right: solid 1px rgb(104, 136, 167);
                                }
                        
                                #nfse-competence p:nth-child(1) {
                                    margin: 5px 0 0 0;
                                    font-size: 10px;
                                    line-height: 10px;
                                }
                        
                                #nfse-code {
                                    width: 20%;
                                    padding: 0 0 0 10px;
                                }
                        
                                #nfse-code p:nth-child(1) {
                                    margin: 5px 0 0 0;
                                    font-size: 10px;
                                    line-height: 10px;
                                }
                        
                                #emitter-area {
                                    margin-top: 5px;
                                    width: 100%;
                                    display: -webkit-flex;
                                    border: solid 1px rgb(104, 136, 167);
                                    border-radius: 15px;
                                }
                        
                                #emitter-picture {
                                    width: 25%;
                                    padding: 10px 0 10px 10px;
                                }
                
                                #emitter-picture img {
                                    height: 100px;
                                    max-width: 200px;
                                }
                        
                                #emitter-data {
                                    padding: 10px 0 10px 10px;
                                    display: -webkit-flex;
                                    -webkit-flex-wrap: wrap;
                                    width: 75%;
                                }
                        
                                #emmiter-company-name {
                                    width: 100%;
                                    font-weight: bolder;
                                }
                        
                                #emmiter-cnpj-cpf {
                                    width: 50%;
                                    font-weight: bolder;
                                }
                        
                                #emmiter-municipal-registration {
                                    width: 50%;
                                    font-weight: bolder;
                                }
                        
                                #emmiter-full-address {
                                    width: 100%;
                                }
                        
                                #emmiter-phone {
                                    width: 50%;
                                }
                        
                                #emmiter-email {
                                    width: 50%;
                                }
                        
                                #taker-area {
                                    width: 100% - 20px;
                                    display: -webkit-flex;
                                    -webkit-flex-wrap: wrap;
                                    padding: 10px;
                                    border: solid 1px rgb(104, 136, 167);
                                    border-radius: 15px;
                                    margin-top: 5px;
                                }
                        
                                #taker-title {
                                    width: 100%;
                                    font-weight: bolder;
                                    border-bottom: solid 1px rgb(104, 136, 167);
                                    margin-bottom: 5px;
                                }
                        
                                #taker-cnpj-cpf {
                                    width: 50%;
                                    font-weight: bolder;
                                    margin-bottom: 5px;
                                }
                        
                                #taker-municipal-registration {
                                    width: 50%;
                                    font-weight: bolder;
                                    margin-bottom: 5px;
                                }
                        
                                #taker-company-name {
                                    width: 50%;
                                    font-weight: bolder;
                                    margin-bottom: 5px;
                                }
                        
                                #taker-full-address {
                                    width: 100%;
                                    margin-bottom: 5px;
                                }
                        
                                #taker-phone {
                                    width: 50%;
                                }
                        
                                #taker-email {
                                    width: 50%;
                                }
                        
                                #service-area {
                                    width: 100% - 20px;
                                    display: -webkit-flex;
                                    -webkit-flex-wrap: wrap;
                                    padding: 10px;
                                    border: solid 1px rgb(104, 136, 167);
                                    border-radius: 15px;
                                    margin-top: 5px;
                                }
                        
                                #service-title {
                                    width: 100%;
                                    font-weight: bolder;
                                    border-bottom: solid 1px rgb(104, 136, 167);
                                    margin-bottom: 5px;
                                }
                        
                                #municipal-tax-code {
                                    width: 100% - 20px;
                                    padding: 10px;
                                    margin-top: 5px;
                                    background: rgb(226, 226, 226);
                                }
                        
                                #municipal-tax-code p:nth-child(1) {
                                    font-weight: bolder;
                                }
                        
                                #lc11603-and-description {
                                    width: 100% - 20px;
                                    padding: 10px;
                                    margin-top: 5px;
                                }
                        
                                #lc11603-and-description p:nth-child(1) {
                                    font-weight: bolder;
                                }
                        
                                #city-and-code {
                                    width: 100% - 20px;
                                    padding: 10px;
                                    margin-top: 5px;
                                    background: rgb(226, 226, 226);
                                }
                        
                                #city-and-code p:nth-child(1) {
                                    font-weight: bolder;
                                }
                        
                                #operation-type {
                                    width: 100% - 20px;
                                    float: left;
                                    padding: 10px;
                                    margin-top: 5px;
                                }
                        
                                #operation-type p:nth-child(1) {
                                    font-weight: bolder;
                                }
                        
                                #tax-area {
                                    width: 100%;
                                    margin-top: 5px;
                                }
                        
                                #tax-area-left {
                                    float: left;
                                    margin-right: inherit;
                                    min-width: 45%;
                                    padding: 10px;
                                    border: 1px solid rgb(104, 136, 167);
                                    border-radius: 15px;
                                    height: 180px;
                                }
                        
                                #tax-left-title {
                                    font-weight: bolder;
                                }
                        
                                #tax-left-title span:nth-child(1) {
                                    float: left;
                                }
                        
                                #tax-left-title span:nth-child(2) {
                                    float: right;
                                }
                        
                                #tax-discount span:nth-child(1) {
                                    float: left;
                                }
                        
                                #tax-discount span:nth-child(2) {
                                    float: right;
                                }
                        
                                #tax-federal-retention span:nth-child(1) {
                                    float: left;
                                }
                        
                                #tax-federal-retention span:nth-child(2) {
                                    float: right;
                                }
                        
                                #tax-iss-taken span:nth-child(1) {
                                    float: left;
                                }
                        
                                #tax-iss-taken span:nth-child(2) {
                                    float: right;
                                }
                        
                                #net-value span:nth-child(1) {
                                    float: left;
                                    color: rgb(122, 13, 13);
                                    font-weight: bolder;
                                }
                        
                                #net-value span:nth-child(2) {
                                    float: right;
                                    color: rgb(122, 13, 13);
                                    font-weight: bolder;
                                }
                                
                                #tax-area-right {
                                    float: right;
                                    min-width: 45%;
                                    padding: 10px;
                                    border: 1px solid rgb(104, 136, 167);
                                    border-radius: 15px;
                                    height: 180px;
                                }
                        
                                #tax-right-title {
                                    font-weight: bolder;
                                }
                        
                                #tax-right-title span:nth-child(1) {
                                    float: left;
                                }
                        
                                #tax-right-title span:nth-child(2) {
                                    float: right;
                                }
                        
                                #tax-deduction span:nth-child(1) {
                                    float: left;
                                }
                        
                                #tax-deduction span:nth-child(2) {
                                    float: right;
                                }
                        
                                #unconditional-discount span:nth-child(1) {
                                    float: left;
                                }
                        
                                #unconditional-discount span:nth-child(2) {
                                    float: right;
                                }
                        
                                #calculation-basis span:nth-child(1) {
                                    float: left;
                                    font-weight: bolder;
                                }
                        
                                #calculation-basis span:nth-child(2) {
                                    float: right;
                                    font-weight: bolder;
                                }
                        
                                #aliquot span:nth-child(1) {
                                    float: left;
                                }
                        
                                #aliquot span:nth-child(2) {
                                    float: right;
                                }
                        
                                #iss-value span:nth-child(1) {
                                    float: left;
                                    font-weight: bolder;
                                    color: rgb(122, 13, 13);
                                }
                        
                                #iss-value span:nth-child(2) {
                                    float: right;
                                    font-weight: bolder;
                                    color: rgb(122, 13, 13);
                                }
                        
                                #others-area {
                                    width: 100% - 20px;            
                                    padding: 10px;
                                    border: solid 1px rgb(104, 136, 167);
                                    border-radius: 15px;
                                    margin-top: 5px;
                                }
                        
                                #others-area p:nth-child(1) {
                                    font-weight: bolder;
                                }
                        
                                #footer-area {
                                    margin-top: 5px;
                                    width: 100%;
                                    display: -webkit-flex;
                                }
                        
                                #footer-picture {
                                    width: 15%;
                                    padding: 10px 0 10px 10px;
                                }
                        
                                #footer-data {
                                    padding: 10px 0 10px 10px;
                                    display: -webkit-flex;
                                    -webkit-flex-wrap: wrap;
                                    width: 85%;
                                }
                        
                                .clear {
                                    clear: both;
                                }
                        
                                .row {
                                    border-bottom: 1px solid rgb(104, 136, 167);
                                    margin-bottom: 5px;
                                }
                        
                                @page {
                                    size: A4;
                                    margin: 0;
                                }
                        
                                @media print {
                                    div#footer-area {
                                        position: fixed;
                                        bottom: 0;
                                    }
                                    html,
                                    body {
                                        width: 210mm;
                                        height: 297mm;
                                    }
                                }
                                </style>
                            </head>
                            <body>
                                <div id="main">        
                                    <div id="top-bar">NFS-e - NOTA FISCAL DE SERVIÇOS ELETRÔNICA</div>
                                
                                    <div id="nfse-area">
                                        <div id="nfse-number">Nº:${populateTemplate.principal['numero']}</div>
                                        <div id="nfse-date">
                                            <p>Emitida em:</p>
                                            <p>${formatDate(populateTemplate.principal['dataEmissao'].split('T')[0], 'pt-br')} <span>às ${populateTemplate.principal['dataEmissao'].split('T')[1].substr(0, 5)}</span></p>
                                        </div>
                                        <div id="nfse-competence">
                                            <p>Competência:</p>
                                            <p>${formatDate(populateTemplate.principal['dataEmissao'].split('T')[0], 'pt-br')}</p>
                                        </div>
                                        <div id="nfse-code">
                                            <p>Código de verificação:</p>
                                            <p>${populateTemplate.principal['codigoVerificacao']}</p>
                                        </div>
                                    </div>
                                    <div id="emitter-area">
                                        <div id="emitter-picture"><img src="${object.logoEmpresa}" alt="Logo"></div>
                                        <div id="emitter-data">
                                            <div id="emmiter-company-name">${populateTemplate.prestadorServico['razaoSocial']}</div>
                                            <div id="emmiter-cnpj-cpf"> 
                                                CPF/CNPJ: ${populateTemplate.prestadorServico['identificacaoPrestador']['cpfCnpj']['cnpj']} ${populateTemplate.prestadorServico['identificacaoPrestador']['cpfCnpj']['cpf']}
                                            </div>
                                            <div id="emmiter-municipal-registration">
                                                Inscrição Municipal: ${populateTemplate.prestadorServico['identificacaoPrestador']['inscricaoMunicipal']}
                                            </div>
                                            <div id="emmiter-full-address">
                                                ${populateTemplate.prestadorServico['endereco']['endereco']}, ${populateTemplate.prestadorServico['endereco']['numero']} - ${populateTemplate.prestadorServico['endereco']['bairro']} - CEP: ${populateTemplate.prestadorServico['endereco']['cep']}
                                            </div>
                                            <div id="emmiter-phone">Telefone: ${populateTemplate.prestadorServico['contato']['telefone']}</div>
                                            <div id="emmiter-email">Email: ${populateTemplate.prestadorServico['contato']['email']}</div>
                                        </div>
                                    </div>
                                
                                    <div id="taker-area">
                                        <div id="taker-title">Tomador do Serviço</div>
                                        <div id="taker-cnpj-cpf">CPF/CNPJ: ${populateTemplate.tomadorServico['identificacaoTomador']['cpfCnpj']['cnpj']} ${populateTemplate.tomadorServico['identificacaoTomador']['cpfCnpj']['cpf']}</div>
                                        <div id="taker-municipal-registration">Inscrição Municipal: ${populateTemplate.tomadorServico['identificacaoTomador']['inscricaoMunicipal']}</div>
                                        <div id="taker-company-name">${populateTemplate.tomadorServico['razaoSocial']}</div>
                                        <div id="taker-full-address">
                                            ${populateTemplate.tomadorServico['endereco']['endereco']}, ${populateTemplate.tomadorServico['endereco']['numero']} - ${populateTemplate.tomadorServico['endereco']['bairro']} - CEP: ${populateTemplate.tomadorServico['endereco']['cep']} - ${populateTemplate.tomadorServico['endereco']['municipio']} / ${populateTemplate.tomadorServico['endereco']['uf']}
                                        </div>
                                        <div id="taker-phone">Telefone: ${populateTemplate.tomadorServico['contato']['telefone']}</div>
                                        <div id="taker-email">Email: ${populateTemplate.tomadorServico['contato']['email']}</div>
                                    </div>
                                
                                    <div id="service-area">
                                        <div id="service-title">Discriminação do serviço</div>
                                        <div id="service-discrimination">${populateTemplate.servico['discriminacao']}</div>
                                    </div>
                                
                                    <div id="municipal-tax-code">
                                        <p>Código de Tributação Municipal:</p>
                                        <p>${populateTemplate.servico['codigoTributacaoMunicipio']}</p>
                                    </div>
                                
                                    <div id="lc11603-and-description">
                                        <p>Subitem Lista de Serviços LC 116/03 / Descrição:</p>
                                        <p>${populateTemplate.servico['descricaoDoServico']}</p>
                                    </div>
                                    
                                    <div id="city-and-code">
                                        <p>Cód/Município da incidência do ISSQN</p>
                                        <p>${populateTemplate.prestadorServico['endereco']['codigoMunicipio']} / ${populateTemplate.prestadorServico['endereco']['municipio']}</p>
                                    </div>
                                    
                                    <div id="operation-type">
                                        <p>Natureza da operação</p>
                                        <p>${populateTemplate.principal['naturezaOperacao']}</p>
                                    </div>
                                    <div class="clear"></div>
                                    
                                    <div id="tax-area">
                                        <div id="tax-area-left">
                                            <div id="tax-left-title"><span>Valor do serviço:</span> <span>R$ ${formatCash(parseFloat(populateTemplate.servico['valores']['baseCalculo']))}</span></div>
                                            <div class="clear row"></div>
                                            <div id="tax-discount"><span>(-) Descontos: </span> <span>R$ ${formatCash(parseFloat(desconto))}</span></div>
                                            <div class="clear row"></div>
                                            <div id="tax-federal-retention"><span>() Retenções Federais: </span> <span>R$ ${formatCash(parseFloat(retencaoFederal))}</span></div>
                                            <div class="clear row"></div>
                                            <div id="tax-federal-retention" style="margin-left: 25px; font-size: 10px;"><span>CSLL: </span> <span>R$ ${parseFloat(populateTemplate.servico['valores']['valorCsll'], 2)}</span></div>
                                            <div class="clear row"></div>
                                            <div id="tax-federal-retention" style="margin-left: 25px; font-size: 10px;"><span>PIS: </span> <span>R$ ${parseFloat(populateTemplate.servico['valores']['valorPis'], 2)}</span></div>
                                            <div class="clear row"></div>
                                            <div id="tax-federal-retention" style="margin-left: 25px; font-size: 10px;"><span>COFINS: </span> <span>R$ ${parseFloat(populateTemplate.servico['valores']['valorCofins'], 2)}</span></div>
                                            <div class="clear row"></div>
                                            <div id="tax-federal-retention" style="margin-left: 25px; font-size: 10px;"><span>IR: </span> <span>R$ ${parseFloat(populateTemplate.servico['valores']['valorIr'], 2)}</span></div>
                                            <div class="clear row"></div>
                                            <div id="tax-federal-retention" style="margin-left: 25px; font-size: 10px;"><span>INSS: </span> <span>R$ ${parseFloat(populateTemplate.servico['valores']['valorInss'], 2)}</span></div>
                                            <div class="clear row"></div>
                                            <div id="tax-iss-taken"><span>(-) ISS Retido na Fonte: </span> <span>R$ ${populateTemplate.servico['valores']['valorIss']}</span></div>
                                            <div class="clear row"></div>
                                            <div id="net-value"><span>Valor Liquido: </span> <span>R$ ${populateTemplate.servico['valores']['valorLiquidoNfse']}</span></div>
                                            <div class="clear row"></div>
                                        </div>
                                        <div id="tax-area-right">
                                            <div id="tax-right-title"><span>Valor do serviço:</span> <span>R$ ${formatCash(parseFloat(populateTemplate.servico['valores']['baseCalculo']))}</span></div>
                                            <div class="clear row"></div>
                                            <div id="tax-deduction"><span>(-) Deduções: </span> <span>R$ ${formatCash(parseFloat(populateTemplate.servico['valores']['valorDeducoes']))}</span></div>
                                            <div class="clear row"></div>
                                            <div id="unconditional-discount"><span>(-) Desconto Incondicionado: </span> <span>R$ ${formatCash(parseFloat(populateTemplate.servico['valores']['descontoIncondicionado']))}</span></div>
                                            <div class="clear row"></div>
                                            <div id="calculation-basis"><span>(=) Base de Cálculo: </span> <span>R$ ${formatCash(parseFloat(populateTemplate.servico['valores']['baseCalculo']))}</span></div>
                                            <div class="clear row"></div>
                                            <div id="aliquot"><span>(x) Alíquota: </span> <span>${(Number((populateTemplate.servico['valores']['aliquota']).replace(',', '.')) < 1) ? (Number((populateTemplate.servico['valores']['aliquota']).replace(',', '.')) * 100).toFixed(2) : populateTemplate.servico['valores']['aliquota']}%</span></div>
                                            <div class="clear row"></div>
                                            <div id="aliquot"><span>ISS Retido: </span> <span>${issRetido}</span></div>
                                            <div class="clear row"></div>
                                            <div id="iss-value"><span>(=) Valor do ISS: </span> <span>R$ ${populateTemplate.servico['valores']['valorIss']}</span></div>
                                            <div class="clear row"></div>
                                        </div>
                                    </div>
                                    <div class="clear"></div>
                            
                                    <div id="footer-area">
                                        <div id="footer-picture">
                                            <img src="file://${__dirname + '/../../resources/img/brasoes-municipios/' + object['codigoMunicipio']}.png" alt="Brasão da prefeitura" height="80px">
                                        </div>
                            
                                        <div id="footer-data">
                                            <div id="emmiter-company-name">${city.prefeitura.name} - ${city.prefeitura.secretaria.name}</div>
                                            <div id="emmiter-full-address">
                                                ${city.prefeitura.secretaria.endereco.endereco}, ${city.prefeitura.secretaria.endereco.numero}, ${city.prefeitura.secretaria.endereco.complemento}, ${city.prefeitura.secretaria.endereco.bairro} - CEP: ${city.prefeitura.secretaria.endereco.cep} - ${city.name} / ${city.stateInitials}
                                            </div>
                                            <div id="emmiter-phone">Telefone: ${city.prefeitura.secretaria.contato.telefone[0].numero}</div>
                                            <div id="emmiter-email">Email: ${city.prefeitura.secretaria.contato.email[0].descricao}</div>
                                        </div>
                                    </div>
                                </div>
                            </body>
                            </html>`;
            resolve(html);
        } catch (error) {
            reject(error);
        }
    })
}

const formatDate = (data, formato) => {
    if (formato == 'pt-br') {
        return (data.substr(0, 10).split('-').reverse().join('/'));
    } else {
        return (data.substr(0, 10).split('/').reverse().join('-'));
    }
}

const formatCash = (n) => {
    return n.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
}

module.exports = {
    populateDam
};