 var config = {
 
    videntifier:{
      authorization: 'I0IcuMSxgrtvRZXO6iMb',
      uri:{
        insert: 'https://api.videntifier.com/api/v1/insert',
        recognition: 'https://api.videntifier.com/api/v1/query?include_locations=true'
      }
    },
 
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
    },
    
    hi_res:
    {
      storage: 
        {
          dev: '/mnt/hires/dev/',
          test: '/mnt/hires/test/',
          prod: '/mnt/hires/prod/'              
        },
      collection: 
        {
          dev: 'dev',
          test: 'test',
          prod: 'prod'              
        }
    },
    
    mongo: {
      path: "mongodb://localhost:27017/exampleDb"
    },
    
    iip: {
      IIPHost : '35.166.117.44',
      IIPPath : '/iipsrv/iipsrv.fcgi',
      IIPImageSize:{
            thumb: 100,
            medium: 200,
            large: 500    
      }
    }
        
};

module.exports = config;    