export function mapState(arr) {
  const res = {};
  for (let i = 0; i < arr.length; i++) {
    res[arr[i]] = function() {
      return this.$store.state[arr[i]];
    };
  }
  return res;
}

export function mapGetters(arr) {
  const res = {};
  for (let i = 0; i < arr.length; i++) {
    res[arr[i]] = function() {
      return this.$store.getters[arr[i]];
    };
  }
  return res;
}

export function mapMutations(arr) {
  const res = {};
  for (let i = 0; i < arr.length; i++) {
    res[arr[i]] = function(payload) {
      this.$store.commit(arr[i], payload);
    };
  }
  return res;
}

export function mapActions(arr) {
  const res = {};
  for (let i = 0; i < arr.length; i++) {
    res[arr[i]] = function(payload) {
      this.$store.dispatch(arr[i], payload);
    };
  }
  return res;
}
