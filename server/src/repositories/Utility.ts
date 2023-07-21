/**
 * Fonction permettant de définir une interface statique
 */
export function StaticImplements<T>() {
    return <U extends T>(constructor: U) => { constructor };
}