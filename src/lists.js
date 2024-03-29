import slugify from 'slugify';
import { get, writable } from 'svelte/store';

import { user } from './auth';
import { db } from './firebase';

const gamesRef = db.collection('games');
const listsRef = db.collection('lists');

export const lists = (() => {
	const lists = writable([]);

  let uid;

  function reset() {
    lists.set([]);
  }

  function fetch() {
    const listsQuery = listsRef.where('uid', '==', uid)

    listsQuery
      .onSnapshot(snapshot => {
        lists.set(snapshot.docs.map(d => {
          return {
            id: d.id,
            ...d.data(),
          };
        }));
      }, error => {
        // todo
      });
  }

  function generateSlugFromName(name) {
    const slug = slugify(name, {
      lower: true,
      strict: true,
    });

    if (get(lists).find(l => l.slug === slug)) {
      throw {name: 'NameTakenError'};
    }

    return slug;
  }

  function add({ name }) {
    const slug = generateSlugFromName(name);

    listsRef
      .add({ uid, name, slug })
      .catch(e => {/* todo */});
  }

  function remove(id) {
    listsRef
      .doc(id)
      .delete()
      .catch(e => {/* todo */});
  }

  function update({id, ...list}) {
    const slug = generateSlugFromName(list.name);

    list.slug = slug;

    return listsRef
      .doc(id)
      .update(list)
      .catch(e => {/* todo */});
  }

  user.subscribe(u => {
    if (u) {
      uid = u.uid;
      fetch();
    } else {
      uid = undefined;
      reset();
    }
  });

	return {
		subscribe: lists.subscribe,
    reset,
    add,
    remove,
    update,
	};
})();

export function listItemsForId(id) {
  const listItems = new writable([]);
  const listItemsRef = listsRef.doc(id).collection('listItems');

  listItemsRef
    .onSnapshot(snapshot => {
      listItems.set(snapshot.docs.map(l => ({id: l.id, ...l.data()})));
    }, error => {
      // todo
    });

  function remove(id) {
    listItemsRef
      .doc(id)
      .delete()
      .catch(e => {/* todo */});
  }

  function add(listItem) {
    if (!listItem.platformId) {
      delete listItem.platformId;
    }

    listItemsRef
      .add(listItem)
      .catch(e => {/* todo */});
  }

  async function move(id, newListId) {
    const listItemRef = listItemsRef.doc(id);
    const newListItemsRef = listsRef.doc(newListId).collection('listItems');

    try {
      const listItem = await listItemRef.get().then(doc => doc.data());
      const batch = db.batch();

      listItemRef.delete();
      newListItemsRef.add(listItem);
      batch.commit();
    } catch(e) {
      // todo
    }
  }

  return {
    subscribe: listItems.subscribe,
    remove,
    add,
    move,
  };
}

export function gameForId(id) {
  const game = new writable(undefined);

  gamesRef
    .doc(id.toString())
    .get({source: 'cache'})
    .then(g => game.set({id: g.id, ...g.data()}))
    .catch(e => {
      gamesRef
        .doc(id.toString())
        .get({source: 'server'})
        .then(g => game.set({id: g.id, ...g.data()}));
    });

  return game;
}

export function gameForSlug(slug) {
  const game = new writable(undefined);

  gamesRef
    .where('slug', '==', slug)
    .get({source: 'cache'})
    .then(g => game.set({id: g.docs[0].id, ...g.docs[0].data()}))
    .catch(e => {
      gamesRef
        .where('slug', '==', slug)
        .get({source: 'server'})
        .then(g => game.set({id: g.docs[0].id, ...g.docs[0].data()}))
        .catch(e => {
          // todo
          console.error(e);
        });
    });

  return game;
}

export function gamesForIds(ids) {
  const games = new writable({});

  if (ids && ids.length) {
    ids.forEach(id => {
      gameForId(id).subscribe(game => {
        if (game) {
          games.update(g => {
            g[game.id] = game;
            return g;
          });
        }
      });
    });
  }

  return {
    subscribe: games.subscribe,
  };
}
