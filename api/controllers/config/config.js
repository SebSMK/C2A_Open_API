 var config = {
 
    get_image_iiif:{        
        id: 'damlit',
        host: 'csdev-seb-02',
        port: 8983,
        core: '/solr/dev_DAM_PIC',
        query:{
          def: {                                   
            'wt': 'json',
            'indent': true,
            'json.nl': 'map'            
          },
          fixed: {
            'fl': 'value'
          },
          exclude: ['fq']
        },
        iiifserver: "http://iip.smk.dk/iiif/%s"
    }
};

module.exports = config;    