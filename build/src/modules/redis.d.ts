declare const _default: {
    getCached: (req: any, res: any, next: any) => Promise<void>;
    caching: (key: any, data: any) => Promise<void>;
    delCache: (key: any) => void;
    setExpire: (key: any, time?: number) => void;
};
export default _default;
