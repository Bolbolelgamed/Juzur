      if (window.location.hostname === 'bolbolelgamed.github.io') {
        const destination = new URL('https://www.techwood-art.com/');
        destination.search = window.location.search;
        destination.hash = window.location.hash;
        window.location.replace(destination.toString());
      }
